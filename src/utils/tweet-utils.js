'use strict'

/**
 * Contains utilities for working with tweets.
 */
var tweetUtils = {
  /**
   * Sorts an array of objects representing tweets by popularity. Every object
   * in the tweets array must have a popularity property for this function to
   * work. Sorts the array in place.
   *
   * @param  {type} tweets description
   */
  sortTweets: function (tweets) {
    tweets.sort(function compare (tweet1, tweet2) {
      if (tweet1.popularity < tweet2.popularity) {
        return -1
      }
      if (tweet1.popularity > tweet2.popularity) {
        return 1
      }
      return 0
    })
  }
}

module.exports = tweetUtils
