'use strict'
const sentiment = require('sentiment')

/**
 * Construct a new SentimentBank object.
 *
 */
function SentimentBank () {
  let analyzed = 0
  let totalSentiment = 0

  /**
   * Add a tweet to the tweet sentiment analysis.
   *
   * @param {String} tweetText Text to analyzed and add to average
   */
  this.addText = function (tweet) {
    totalSentiment += sentiment(tweet).score
    analyzed++
  }

  /**
   * Return the average sentiment for the analyzed tweets.
   *
   * @return {Number} The average sentiment for the analyzed tweets
   */
  this.getSentiment = function () {
    return analyzed !== 0 ? totalSentiment / analyzed : 0
  }

  /**
   * Return the number of analyzed tweets.
   *
   * @return {Number} The number of analyzed tweets
   */
  this.getAnalyzed = function () {
    return analyzed
  }
}

module.exports = SentimentBank
