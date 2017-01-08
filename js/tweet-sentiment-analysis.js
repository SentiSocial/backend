'use strict'
var sentiment = require('sentiment')

/**
 * Construct a new TweetSentimentAnalysis object.
 *
 * @author GunshipPenguin
 * @constructor
 */
var TweetSentimentAnalysis = function () {
  var _analyzed = 0
  var _sentiment = 0

  /**
   * Add a tweet to the tweet sentiment analysis.
   *
   * @param {String} tweetText Text to analyzed and add to average
   * @param {Number} Weight weight to assign to the sentiment value in the average, defaults to 1 if undefined
   */
  this.addTweet = function (tweet, weight) {
    if (weight === undefined) {
      weight = 1
    }

    var sen = sentiment(tweet)

    _sentiment = (_analyzed * _sentiment + sen.score * weight) / (_analyzed + 1)
    _analyzed++
  }

  /**
   * Return the average sentiment for the analyzed tweets.
   *
   * @return {Number} The average sentiment for the analyzed tweets
   */
  this.getSentiment = function () {
    return _sentiment
  }

  /**
   * Return the number of analyzed tweets.
   *
   * @return {Number} The number of analyzed tweets
   */
  this.getAnalyzed = function () {
    return _analyzed
  }
}

module.exports = TweetSentimentAnalysis
