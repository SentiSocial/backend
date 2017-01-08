'use strict'
var Twitter = require('twitter')
var apiKeys = require('./api-keys')
var config = require('./config')
var popularTweetUtils = require('./tweet-utils')

var client = new Twitter({
  consumer_key: apiKeys.twitter_consumer_key,
  consumer_secret: apiKeys.twitter_consumer_secret,
  bearer_token: apiKeys.twitter_bearer_token
})

/**
 * Contains functions for getting tweets from twitter using the search API.
 *
 * @author GunshipPenguin
 */
var tweetSearch = {

  /**
   * Get's a sample of popular and recent tweets for the givent rend, calling the
   * callback function with an array of tweets objects. Each tweet object * contains
   * the tweet id, text and popularity, and tweets are sorted by popularity.
   *
   * @param  {String} Trend Trend to get tweets for
   * @param  {Number} Number of tweets to retreive
   * @param  {Function} callback description
   */
  getTweetSample: function (trend, num, callback) {
    var tweets = []
    var tweetsRetrieved = 0

    client.get('search/tweets', {q: trend, result_type: 'mixed', count: num}, function appendTo (error, result, response) {
      if (error) {
        console.log(error)
        throw error
      }

      // If there are returned statuses
      if (result.statuses.length !== 0) {
        // Add all tweets to the tweets array
        var lowestId = Number.MAX_SAFE_INTEGER
        result.statuses.forEach(function (tweet) {
          tweetsRetrieved++

          // Check for lowest id
          if (tweet.id < lowestId) {
            lowestId = tweet.id
          }

          // Add the tweet text, id and popularity to tweets
          tweets.push({
            text: tweet.text,
            id: tweet.id,
            popularity: tweet.retweet_count + tweet.favorite_count
          })
        })

        // If there are more tweets to retrieve, make a recursive async call
        if (tweetsRetrieved <= num) {
          client.get('search/tweets', {q: trend, count: config.popularTweetsPerSearch, max_id: lowestId}, appendTo)
        } else {
          popularTweetUtils.sortTweets(tweets)
          callback(tweets)
        }
      } else {
        popularTweetUtils.sortTweets(tweets)
        callback(tweets)
      }
    })
  }
}

module.exports = tweetSearch
