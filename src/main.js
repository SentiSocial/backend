'use strict'
const mongoose = require('mongoose')
const news = require('./news')
const api = require('./api')
const trends = require('./trends')
const config = require('./config')
const tweetSearch = require('./tweet-search')
const TweetSentimentAnalysis = require('./tweet-sentiment-analysis')
const Trend = require('./models/trend')
const Article = require('./models/article')
const Tweet = require('./models/tweet')

// Connect to the db, then set up the intervalFunction
var db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('Successfully connected to mongodb')
  // Run the intervalFunction when the backend starts
  intervalFunction()

  // Then set up intervalFunction to run each server interval
  setInterval(intervalFunction, config.intervalLength)

  api.start()
})
mongoose.connect('mongodb://' + config.dbAddress + '/' + config.dbName)

/**
 * Function run once every server interval, gets trends from the
 * Twitter API, news from the news API and stores all relavant
 * information in the database.
 *
 */
function intervalFunction () {
  // At the beginning of each interval get all trends
  trends.getTrends(function (trends) {
    // Remove all old trends
    removeOldTrends(trends, function () {
      // Update all current trends
      updateTrends(trends.slice(0, 8)) // .slice to avoid hitting rate limit while testing, remove later
    })
  })
}

/**
 * Removes all trends from the database not in the currTrends array.
 *
 * @param {Array} currTrends Array of trend names to be retained in database
 * @param {type} cb Function to be called when trends have been deleted
 */
var removeOldTrends = function (currTrends, cb) {
  Trend.remove({name: {$nin: currTrends}}, err => {
    if (err) {
      console.log('Error while removing old trends')
      throw err
    }
    cb()
  })
}

/**
 * Updates information for all trends in the trends array. Adds new news
 * articles and popular tweets to the database as well as adding a new
 * sentiment score to each trend.
 *
 * @param {Array} trends Array of trend names to update in the database
 */
function updateTrends (trends) {
  trends.forEach(function (trend) {
    tweetSearch.getTweetSample(trend, config.popularTweetsRetreivedTotal, tweets => {
      // Get a sentiment score for tweets, and store it in the db
      let sentimentScore = analyzeTweets(trend, tweets)
      storeSentimentInfo(trend, sentimentScore, Date.now())

      // Store the popular tweets from tweets in the db
      storeTweets(trend, tweets)
    })

    // Store news articles
    news(trend, articles => {
      storeArticles(trend, articles)
    })
  })
}

function storeSentimentInfo (trend, sentimentScore, timestamp) {
  let sentiment = {
    sentiment: sentimentScore,
    timestamp: timestamp
  }

  // Update this trend's sentiment, or create a new trend if this trend doesn't already exist
  Trend.findOneAndUpdate({name: trend}, {$push: {history: sentiment}},
    {upsert: true}, (err, doc) => {
      if (err) {
        console.log('Error updating sentiment information in database')
        throw err
      }
    })
}

/**
 * Stores all the given tweets for the given trend in the database.
 *
 * @param {String} trend Trend to store tweets for
 * @param {Array} tweets Tweets to store in the database
 */
function storeTweets (trend, tweets) {
  // Add tweets for this trend to the database
  let reducedTweets = tweets.slice(0, config.tweetsStored)
  reducedTweets.forEach((tweet) => {
    let dbTweet = {
      trend: trend,
      embed_id: tweet.id,
      popularity: tweet.popularity
    }
    // Add dbTweet to the database only if it does not already exist in
    // the database
    Tweet.findOneAndUpdate({embed_id: tweet.id}, {$setOnInsert: dbTweet},
      {upsert: true}, (err, doc) => {
        if (err) {
          console.log('Error adding tweet to database')
          throw err
        }
      })
  })
}

/**
 * Stores all the given news articles for the given trend in the database.
 *
 * @param {String} trend Name of trend to store articles for
 * @param {Array} articles Array of news articles to store info for
 */
function storeArticles (trend, articles) {
  // Get and store news for this trend
  articles.forEach(article => {
    // Object representing this article
    let currArticle = {
      trend: trend,
      title: article.title,
      description: article.description,
      source: article.source,
      media: article.media,
      link: article.link,
      timestamp: article.timestamp
    }

    // Add the article to the db only if it does not alreay exist in the db
    // Note: We don't have a unique ID for news articles, so we use
    // the article title and link as an identifier (Should cover 99.99% of cases)
    Article.findOneAndUpdate({title: article.title, link: article.link}, {$setOnInsert: currArticle}, {upsert: true}, (err, doc) => {
      if (err) {
        console.log('Error adding news article to database')
        throw err
      }
    })
  })
}

/**
 * Analyze the sentiment of all tweets in the tweets array and return an
 * integer representing the sentiment score of the tweets.
 *
 * @param {String} trend Trend to store sentiment analysis for
 * @param {Array} tweets Array of tweets to analyze sentiment of
 * @param {String} tweet.text Text of the tweet
 */
function analyzeTweets (trend, tweets) {
  // Analyze the sentiment of all tweets in tweets
  let tweetSentimentAnalysis = new TweetSentimentAnalysis()
  tweets.forEach(tweet => {
    tweetSentimentAnalysis.addTweet(tweet.text)
  })

  return tweetSentimentAnalysis.getSentiment()
}
