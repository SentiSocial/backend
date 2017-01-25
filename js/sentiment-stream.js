'use strict'
var TweetSentimentAnalysis = require('./tweet-sentiment-analysis')
var apiKeys = require('./api-keys')
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: apiKeys.twitter_consumer_key,
  consumer_secret: apiKeys.twitter_consumer_secret,
  access_token_key: apiKeys.twitter_access_token_key,
  access_token_secret: apiKeys.twitter_access_token_secret
})

/**
 * Construct a new SentimentStream to listen for tweets for trends and create
 * an average for each trend sentiment.
 *
 * @author GunshipPenguin
 * @param {Array} trends Array of trends to calculate average sentiments for
 * @return {type} description
 */
var SentimentStream = function (trends) {
  // Construct a mapping of trends as strings to TweetSentimentAnalysis object
  var _sentiments = {}
  trends.forEach(function (trend) {
    _sentiments[trend] = new TweetSentimentAnalysis()
  })

  /**
   * Analyze the sentiment of tweetText and add the value to the averages for
   * each trend.
   *
   * @param {String} tweetText The tweetText to analyze
   */
  var _analyzeTweet = function (tweetText) {
    var tweetTextLower = tweetText.toLowerCase()

    for (var trend in _sentiments) {
      if (tweetTextLower.indexOf(trend.toLowerCase()) !== -1) {
        console.log(tweetText)
        _sentiments[trend].addTweet(tweetText)
      }
    }
  }

  // Create stream object to connect to Twitter API
  var _stream = client.stream('statuses/sample', {language: 'en'})

  /**
   * Get an object mapping sentiments as strings to an associated tweetSentimentAnalysis
   * object.
   *
   * @return {Object} description
   */
  this.getSentiments = function () {
    return _sentiments
  }

  /**
   * Start listening to the Twitter streaming API and analyzing sentiment of
   * tweets.
   *
   */
  this.startStream = function () {
    _stream.on('data', function (event) {
      _analyzeTweet(event.text)
    })
  }

  /**
   * Stop listening to the Twitter streaming API.
   *
   */
  this.stopStream = function () {
    _stream.destroy()
  }
}

module.exports = SentimentStream
