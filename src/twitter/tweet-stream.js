'use strict'
const Twitter = require('twitter')
const apiKeys = require('../api-keys')
const KeywordBank = require('./keyword-bank')
const SentimentBank = require('./sentiment-bank')
const config = require('../../config')

var client = new Twitter({
  consumer_key: apiKeys.twitterConsumerKey,
  consumer_secret: apiKeys.twitterConsumerSecret,
  access_token_key: apiKeys.twitterAccessTokenKey,
  access_token_secret: apiKeys.twitterAccessTokenSecret
})

/**
 * Constructor for an object that manages a connection to the streaming API,
 * monitoring a provided list of trends and collecting information on them.
 *
 * @return {Object} A new TweetStream object
 */
function TweetStream () {
  var stream = null

  // Array mapping trend names to collected info on that trend
  var trendData = {}

  // Array of objects containing trend names and regexes to match for them
  var trendRegexes = []

  /**
   * Start collecting data for the trend names listed in the trends array.
   *
   * @param  {Array} trends List of trend names as strings to track
   */
  this.startTracking = function (trends) {
    // Close the stream (if one is open already)
    this.closeStream()

    // Build array of regexes to match trends against in tweet text
    trendRegexes = trends.map(trendName => {
      // Case insensitive search
      return {name: trendName, regex: new RegExp(trendName, 'i')}
    })

    // Fill the trendData object
    trendData = {}
    trends.forEach(trend => {
      trendData[trend] = {
        sentimentBank: new SentimentBank(trend),
        keywordBank: new KeywordBank(),
        tweets_analyzed: 0
      }
    })

    stream = client.stream('statuses/filter', {track: trends.join(','), language: 'en'})

    stream.on('data', event => {
      // Log streaming API warnings
      if (event.warning) {
        console.error('Warning from streaming API: ', event)
        return
      }

      // Identify the trend and update trendData
      trendRegexes.forEach(trendRegex => {
        if (event.text.match(trendRegex.regex)) {
          trendData[trendRegex.name].sentimentBank.addText(event.text)
          trendData[trendRegex.name].keywordBank.addText(event.text)
          trendData[trendRegex.name].tweets_analyzed++
        }
      })
    })

    stream.on('error', error => {
      console.error(error)
    })
  }

  /**
   * Close the connection to the streaming API
   */
  this.closeStream = function () {
    if (stream) {
      stream.destroy()
    }
  }

  /**
   * Returns data collected so far for each trend from the streamin API.
   *
   * @return {type}  description
   */
  this.getData = function () {
    var returnTrendData = {}

    Object.keys(trendData).forEach(trend => {
      // Omit sentiment_prelim and keywordBank from the return
      returnTrendData[trend] = {}

      returnTrendData[trend].sentiment = trendData[trend].sentimentBank.getSentiment()
      returnTrendData[trend].keywords = trendData[trend].keywordBank.getTopKeywords(config.maxKeywordsPerTrend)
      returnTrendData[trend].tweets_analyzed = trendData[trend].tweets_analyzed
    })

    return returnTrendData
  }
}

module.exports = TweetStream
