'use strict'
const Twitter = require('twitter')
const sentiment = require('sentiment')
const _ = require('underscore')
const apiKeys = require('../api-keys')

var client = new Twitter({
  consumer_key: apiKeys.twitter_consumer_key,
  consumer_secret: apiKeys.twitter_consumer_secret,
  access_token_key: apiKeys.twitter_access_token_key,
  access_token_secret: apiKeys.twitter_access_token_secret
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
      trendData[trend] = {tweets_analyzed: 0, sentiment_prelim: 0}
    })

    stream = client.stream('statuses/filter', {track: trends.join(',')})

    stream.on('data', event => {
      // Ignore all streaming API messages except tweets
      if (!event.text) {
        return
      }

      var sentimentScore = sentiment(event.text).score

      // Identify the trend and update trendData
      trendRegexes.forEach(trendRegex => {
        if (event.text.match(trendRegex.regex)) {
          // Add sentiment (Sentiment is averaged when data is returned)
          trendData[trendRegex.name].sentiment_prelim += sentimentScore
          trendData[trendRegex.name].tweets_analyzed ++
        }
      })
    })

    stream.on('error', function (error) {
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
      // Omit sentiment_prelim from the return
      returnTrendData[trend] = _.omit(trendData[trend], 'sentiment_prelim')

      // Average the sentiment (avoiding dividing by zero if tweets_analyzed == 0)
      var avgSentiment = trendData[trend].tweets_analyzed > 0
      ? trendData[trend].sentiment_prelim / trendData[trend].tweets_analyzed : 0
      returnTrendData[trend].sentiment = avgSentiment
    })

    return returnTrendData
  }
}

module.exports = TweetStream
