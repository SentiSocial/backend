'use strict'
var news = require('./news')
var api = require('./api')
var trends = require('./trends')
var config = require('./config')
var tweetSearch = require('./tweet-search')
var TweetSentimentAnalysis = require('./tweet-sentiment-analysis')
var db = require('./db-access')

var dbConn

var startBackend = function () {
  // Connect to the database
  dbConn = new db(function () {
    console.log('Connected to database, starting backend')

    // Run intervalFunction each server interval
    setInterval(intervalFunction, config.intervalLength)

    // Run the intervalFunction when the backend starts
    intervalFunction()
  })
}

/**
 * Function run once every server interval, gets trends from the
 * Twitter API, news from the news API and stores all relavant
 * information in the database.
 *
 */
var intervalFunction = function () {
  // At the beginning of each interval get all trends
  trends.getTrends(function (trends) {
    // Remove any old trends and add all new trends to the db
    dbConn.addNewTrends(trends, function () {
      // Once old trends have been removed and new ones added, iterate through all trends
      trends.forEach(function (trend) {
        tweetSearch.getTweetSample(trend, config.popularTweetsRetreivedTotal, function (tweets) {
          // Analyze tweets and store that information
          analyzeTweets(trend, tweets)
        })

        // Get and store news for this trend
        getNews(trend)
      })
    })
  })
}

/**
 * Analyze the sentiment of all tweets in the tweets array and store
 * that information in the database under the specified trend.
 *
 * @param {String} trend Trend to store sentiment analysis for
 * @param {Array} tweets Array of tweets to analyze sentiment of
 * @param {String} tweet.text Text of the tweet
 */
var analyzeTweets = function (trend, tweets) {
  // Analyze the sentiment of all tweets in tweets
  var tweetSentimentAnalysis = new TweetSentimentAnalysis()
  tweets.forEach(function (tweet) {
    tweetSentimentAnalysis.addTweet(tweet.text)
  })

  // Construct a history event to add to the database
  var newHistoryEntry = {
    sentiment: tweetSentimentAnalysis.getSentiment(),
    timestamp: Math.floor(Date.now() / 1000)
  }

  // Add newHistoryEvent to the database
  dbConn.addSentimentInfo(trend, newHistoryEntry, function () {})
}


/**
 * Attempt to get news articles for the given trend, if articles are
 * found, store them in the database under the specified trend.
 *
 * @param  {type} trend Trend to find news articles for
 */
var getNews = function (trend) {
  news(trend, function (news) {
    // Store the articles
    dbConn.addNews(trend, news, function () {})
  })
}

startBackend()
