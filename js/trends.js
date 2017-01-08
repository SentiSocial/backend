'use strict'
var Twitter = require('twitter')
var apiKeys = require('./api-keys')

var client = new Twitter({
  consumer_key: apiKeys.twitter_consumer_key,
  consumer_secret: apiKeys.twitter_consumer_secret,
  bearer_token: apiKeys.twitter_bearer_token
})

/**
 * Object containing functions that work with trends.
 */
var trends = {

  /**
   * Returns a list of current worldwide Twitter trends, calls callback with an
   * array of the trends as strings, sorted highest to lowest by popularity.
   *
   * @author GunshipPenguin
   * @param {Function} callback Callback to call with the array of trends
   */
  getTrends: function (callback) {
    var trendsStrings = []

    // Get trending topics
    client.get('trends/place', {id: 23424977}, function (error, trends, response) {
      if (error) {
        console.log(error)
        throw error
      }

      // Add each trend to the trendsStrings array
      trends[0].trends.forEach(function (trend) {
        trendsStrings.push(trend.name)
      })

      callback(trendsStrings)
    })
  }
}

module.exports = trends
