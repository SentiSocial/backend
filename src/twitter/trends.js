'use strict'
var Twitter = require('twitter')
var apiKeys = require('../api-keys')
var config = require('../../config')

var client = new Twitter({
  consumer_key: apiKeys.twitterConsumerKey,
  consumer_secret: apiKeys.twitterConsumerSecret,
  access_token_key: apiKeys.twitterAccessTokenKey,
  access_token_secret: apiKeys.twitterAccessTokenSecret
})

/**
 * Object containing functions that work with trends.
 */
var trends = {

  /**
   * Gets an array of the most popular trends for each of the locations
   * specified in the config to be tracked, returns a promise.
   *
   * @author GunshipPenguin
   * @param {Function} callback Callback to call with the array of trends
   * @return {Promise} Promise
   */
  getTrends: function () {
    // Array of objects containing a woeid and country code
    var locationsTracking = []

    // Object mapping country codes to arrays of trends
    var locationTrends = {}

    // Array containing trends that will be tracked
    var trendsToTrack = []

    var worldwideTrends = []

    // Fills in the locationsTracking array with woeids and country codes
    function fillLocations () {
      return client.get('trends/available', {}).then(locations => {
        locations.forEach(location => {
          if (config.locationsTracking.indexOf(location.woeid) !== -1) {
            locationsTracking.push({woeid: location.woeid, countryCode: location.countryCode})
          }
        })
      }).catch(error => { console.error(error) })
    }

    // Gets trends for the entire world (woeid 1), fills the worldwideTrends
    // array with them
    function getWorldwideTrends () {
      return getTrendsForLocation(1).then(trends => {
        worldwideTrends = trends[0].trends
      }).catch(error => { console.error(error) })
    }

    // Gets the trends for the specified woeid, returns a promise
    function getTrendsForLocation (woeid) {
      return client.get('trends/place', {id: woeid})
      .catch(error => { console.error(error) })
    }

    // Fills the locationsTrends object with countrycode:array_of_trends key
    // value pairs
    function fillTrends () {
      return new Promise((resolve, reject) => {
        let callsMade = 0

        for (var i = 0; i < locationsTracking.length; i++) {
          (i => {
            getTrendsForLocation(locationsTracking[i].woeid).then(trends => {
              locationTrends[locationsTracking[i].countryCode] = trends[0].trends

              callsMade++

              if (callsMade === locationsTracking.length) {
                resolve()
              }
            }).catch(error => { reject(error) })
          })(i)
        }
      })
    }

    // Fills the trendsToTrack array with trends from the locations we're
    // tracking that are on the worldwide trends list, and in the same order
    // as they appear on the worldwide trends list
    function reduceTrends () {
      let rank = 1
      // Iterate over each worldwide trend
      worldwideTrends.forEach(worldwideTrend => {
        const trend = {name: worldwideTrend.name, locations: [], tweet_volume: worldwideTrend.tweet_volume}
        // for each worldwide trend, iterate over each countrycode we have
        Object.keys(locationTrends).forEach(countryCode => {
          // For each country code, iterate over that country's trends
          locationTrends[countryCode].forEach(locationTrend => {
            // If the worldwide trend is a country trend,
            if (worldwideTrend.name === locationTrend.name) {
              // Add this location
              trend.locations.push(countryCode)
            }
          })
        })

        // If this worldwide trend is trending in a location we're tracking
        // add it to the trendsToTrack array
        if (trend.locations.length > 0) {
          trend.rank = rank
          rank++

          trendsToTrack.push(trend)
        }
      })
    }

    return new Promise((resolve, reject) => {
      fillLocations()
      .then(getWorldwideTrends)
      .then(fillTrends)
      .then(reduceTrends)
      .then(() => { resolve(trendsToTrack) })
      .catch(error => { console.error(error) })
    })
  }
}

module.exports = trends
