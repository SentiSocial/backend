'use strict'
const sentiment = require('sentiment')

/**
 * Construct a new SentmentBank object. A SentimentBank is used to keep track
 * of sentiment for incoming text on a particular topic.
 *
 */
function SentimentBank (trendName = '') {
  let analyzed = 0
  let totalSentiment = 0

  // Ignore words occuring in the trend name in sentiment calculations
  let ignoreQuery = {}
  trendName.split(' ').map(word => { return word.replace(/[^a-zA-Z]/g, '').toLowerCase() })
  .forEach(word => { ignoreQuery[word] = 0 })

  /**
   * Add a tweet to the tweet sentiment analysis.
   *
   * @param {String} tweetText Text to analyzed and add to average
   */
  this.addText = function (tweet) {
    totalSentiment += sentiment(tweet, ignoreQuery).score
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
