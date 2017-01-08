'use strict'
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var sentiment = require('sentiment')

var news = require('./news')
var api = require('./api')
var trends = require('./trends')
var config = require('./config')
var tweetSearch = require('./tweet-search')
var SentimentStream = require('./sentiment-stream')
var db = require('./db-access')

var sentimentStream
var searchApiAnalysis
var finalAnalysis
var currTrends
var retPopularTweets

var articlesOverall
var articles

// Access to database
var dbAccess = new db(startBackend)

function startBackend() {
  var getTrends = function() {
    var retVal = []

    var currId = 0
    if (finalAnalysis){
      for (var trend in finalAnalysis) {
        retVal.push({name: trend, sentiment: finalAnalysis[trend].sentiment, id: currId})
        currId++
      }
    } else {
      for (var trend in searchApiAnalysis) {
        retVal.push({name: trend, sentiment: searchApiAnalysis[trend].sentiment, id: currId})
        currId++
      }
    }

    return {trends: retVal}
  }

  var getSpecificTrend = function (trend, callback) {
    var retVal = {}

    // Get history
    dbAccess.getSentimentInfo(trend, function(historyData) {
      retVal = {name: trend, history: {start: 1483820890, end: 1483831017, data: [{volume: 20000, sentiment: 3}, {volume: 18000, sentiment: 5}, {volume: 1000, sentiment: 0}]}}

      callback(retVal)
    })
  }

  var getContent = function (page) {
    var retVal = {}
    retVal.news = articlesOverall.slice(page*3, page*3+3)
    retVal.tweets = retPopularTweets.slice(page*5, page*5+5)
    retVal.remaining = 9
    return retVal
  }

  var getSpecificContent = function (trend, page, callback) {
    dbAccess.getPopularTweets(trend, function(popularTweets) {
      var retVal = {}

      console.dir(articles)
      retVal.news = articles[trend] ? articles[trend] : []
      retVal.tweets = popularTweets
      retVal.remaining = 9
      callback(retVal)
    })
  }

  // Set up api
  var trendsApi = new api(getTrends, getSpecificTrend, getContent, getSpecificContent)

  // Code run prior to the first time based interval callback being run
  trends.getTrends(function (trends) {
    currTrends = trends
    openNewStream(trends)
    analyzeAndStoreTweets(trends)
  })

  // Run each server interval
  setInterval(function() {
    // At the beginning of each interval, we get all trends
    trends.getTrends(function (trends) {

      // Object to store the results of the search + streaming api analysis
      finalAnalysis = {}
      var currTime = new Date()

      // Combine stream analysis with searchApiAnalysis
      for(var trend in sentimentStream.getSentiments()) {
        if (!searchApiAnalysis[trend]) {
          continue
        }
        // Horrible hack. Do not send tweets for which sentiment == 0, this should be based on num analyzed rather than sentiment
        var senScore = ((searchApiAnalysis[trend].sentiment * config.popularTweetWeight) + sentimentStream.getSentiments()[trend].getSentiment()) / (config.popularTweetWeight + 1)
        if (senScore !== 0) {
          finalAnalysis[trend] = {sentiment: senScore, timestamp: currTime.getTime()}
        }
      }

      // Create a new searchApiAnalysis, and store popular tweets in the DB
      analyzeAndStoreTweets(trends)

      // Add sentiment info to the DB
      storeSentimentInfo(finalAnalysis)

      // Add news info to the DB
      //storenewsArticles(trends)

      // Reset the stream
      openNewStream(trends)
    })

  }, config.intervalLength)

  /**
   * Given a mapping of trends to arrays of popular tweets, store all of them in
   * the db for their proper trends.
   *
   * @param {Object} trends Mapping of trends to popular tweets
   */
  var storePopularTweets = function (trends) {
    for(var trend in trends) {
      dbAccess.addPopularTweets(trend, trends[trend])
    }
  }

  /**
   * Add new sentiment values for the given trends at the current timestamp to
   * the DB.
   *
   * @param {Object} trends Mapping of trends to sentiments
   */
  var storeSentimentInfo = function (trends) {
    for(var trend in trends) {
      dbAccess.addSentimentInfo(trend, trends[trend])
    }
  }

  /**
   * Adds news articles to the documents for each of the trends in trends to the
   * db.
   *
   * @param {Object} trends Mapping of trends to arrays of news articles
   */
  var storeNewsArticles = function(trends) {
    for(var trend in trends) {
      dbAccess.addNewsArticles(trend, trends[trend])
    }
  }

  /**
   * Initializes sentimentStream as a new SentimentStream object with the list
   * of given trends, calling stopStream() on any sentimentStream if it existed
   * beforehand.
   *
   * @param {Array} trends Trends to pass into SentimentStream
   */
  var openNewStream = function (trends) {
    // Close all previous stream connections, if a sentimentStream exists (ie. not first run)
    if (sentimentStream) {
      sentimentStream.stopStream()
    }
    sentimentStream = new SentimentStream(trends)
  }

  /**
   * Performs a search api anlysis on the specified trends, storing the results in
   * searchApinalysis. Calls storePopularTweets, with a sample of popular tweets
   * for each trend, to store popular tweets.
   *
   * @param {Trends} trends A list of current trends
   */
  var analyzeAndStoreTweets = function (trends) {
    console.log('called')
    // Reset searchApiAnalysis so that new data can be added
    searchApiAnalysis = {}
    retPopularTweets = []

    // Hackish News gathering
    articlesOverall = []
    articles = {}

    // Iterate over all trends
    trends.slice(0, 30).forEach(function (trend) {


      news(trend, function(fetchedArticles) {
        if (Object.keys(fetchedArticles).length > 0) {
          articlesOverall.push(fetchedArticles[0])
          articles[trend] = fetchedArticles
        }
        console.log(articles)
      })

      // Iterate over a sample of popular tweets for the current trend
      tweetSearch.getTweetSample(trend, config.popularTweetsRetreivedTotal, function (tweets) {
        // Perform a search API analsis on this trend's tweets
        var currAnalyzed = 0
        var currSentiment = 0
        tweets.forEach(function (tweet) {
          var sen = sentiment(tweet.text)

          currSentiment = (currAnalyzed * currSentiment + sen.score) / (currAnalyzed + 1)
          currAnalyzed++
        })
        searchApiAnalysis[trend] = {sentiment: currSentiment, analyzed: currAnalyzed}

        // Store these popular tweets in the DB
        // Cut down tweets to a sizeable value for storage
        if (tweets.length > config.popularTweetsStored) {
          tweets = tweets.slice(0, config.popularTweetsStored)
        }

        // TOTAL HACK for demo, append most popular tweet to array
        if (tweets[0]) {
          retPopularTweets.push(tweets[0])
        }

        // Create a new array containing only the tweet id
        var formattedTweets = []
        tweets.forEach(function(tweet) {
          formattedTweets.push({id: tweet.id})
        })
        dbAccess.addPopularTweets(trend, formattedTweets)
      })
    })
  }
}
