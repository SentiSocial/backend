'use strict'
const Twitter = require('twitter')
const apiKeys = require('../api-keys')

const client = new Twitter({
  consumer_key: apiKeys.twitterConsumerKey,
  consumer_secret: apiKeys.twitterConsumerSecret,
  access_token_key: apiKeys.twitterAccessTokenKey,
  access_token_secret: apiKeys.twitterAccessTokenSecret
})

/**
 * Contains functions for getting tweets from twitter using the search API.
 *
 * @author GunshipPenguin
 */
const tweetSearch = {

  /**
   * Get's a sample of popular and recent tweets for the givent rend, calling the
   * callback function with an array of tweets objects. Each tweet object * contains
   * the tweet id, text and popularity, and tweets are sorted by popularity.
   *
   * @param  {String} Trend Trend to get tweets for
   * @param  {Number} Number of tweets to retreive
   * @param  {Function} callback description
   */
  getTweetSample: function (trend, num) {
    return new Promise((resolve, reject) => {
      client.get('search/tweets', {q: trend, result_type: 'popular', count: num})
      .then(result => {
        const tweets = []
        result.statuses.forEach(tweet => {
          // Add the tweet text, id and popularity to tweets
          tweets.push({
            embed_id: tweet.id_str
          })
        })

        resolve(tweets)
      }).catch(reject)
    })
  }
}

module.exports = tweetSearch
