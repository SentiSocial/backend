const TweetSentimentAnalysis = require('../twitter/tweet-sentiment-analysis')
const Trend = require('../models/trend')

/**
 * Contains utilities used in the main module
 */
const mainUtils = {
  /**
   * Removes all trends from the database not in the currTrends array.
   *
   * @param {Array} currTrends Array of trend names to be retained in database
   * @param {type} cb Function to be called when trends have been deleted
   */
  removeOldTrends: function (currTrends, cb) {
    Trend.remove({name: {$nin: currTrends}}, () => {
      cb()
    })
  },

  /**
   * Analyze the sentiment of all tweets in the tweets array and return an
   * integer representing the sentiment score of the tweets.
   *
   * @param {String} trend Trend to store sentiment analysis for
   * @param {Array} tweets Array of tweets to analyze sentiment of
   * @param {String} tweet.text Text of the tweet
   */
  analyzeTweets: function (trend, tweets) {
    // Analyze the sentiment of all tweets in tweets
    let tweetSentimentAnalysis = new TweetSentimentAnalysis()
    tweets.forEach(tweet => {
      tweetSentimentAnalysis.addTweet(tweet.text)
    })

    return tweetSentimentAnalysis.getSentiment()
  }
}

module.exports = mainUtils
