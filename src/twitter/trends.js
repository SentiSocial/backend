'use strict'
const Twitter = require('twitter')
const apiKeys = require('../api-keys')
var config = require('../../config')

const client = new Twitter({
  consumer_key: apiKeys.twitterConsumerKey,
  consumer_secret: apiKeys.twitterConsumerSecret,
  access_token_key: apiKeys.twitterAccessTokenKey,
  access_token_secret: apiKeys.twitterAccessTokenSecret
})

/**
 * Object containing functions that work with trends.
 */
const trends = {
  /**
   * Gets an array of the most popular trends for each of the locations
   * specified in the config to be tracked, returns a promise.
   *
   * @return {Promise} Promise
   */
  getTrends: function () {
    return new Promise((resolve, reject) => {
      getCountryCodes().then(countryCodes => {
        const locationTrendsPromise = getLocationTrends(countryCodes)
        const worldwideTrendsPromise = getTrendsForLocation(1)

        Promise.all([worldwideTrendsPromise, locationTrendsPromise]).then(values => {
          const worldwideTrends = values[0]
          const locationTrends = values[1]

          resolve(reduceTrends(worldwideTrends, locationTrends))
        })
      })
    })
  }
}

/**
 * Get country codes for each of the woeids in config.locationsTracking.
 * Returns a promise that resolves with an object mapping woeid to country code
 *
 * @return {Promise} Promise that resolves with object mapping woeid to country code
 */
function getCountryCodes () {
  return new Promise((resolve, reject) => {
    const countryCodes = {}

    client.get('trends/available', {}).then(locations => {
      locations.forEach(location => {
        if (config.locationsTracking.indexOf(location.woeid) !== -1) {
          countryCodes[location.woeid] = location.countryCode
        }
      })
      resolve(countryCodes)
    }).catch(reject)
  })
}

/**
 * Gets trending topics in a specific location. Returns a Promise that resolves
 * with a list of trending topics.
 *
 * @param  {Number} woeid Woeid of location to get trends for
 * @return {Promise} Promise that resolves with a list of trending topics
 */
function getTrendsForLocation (woeid) {
  return new Promise((resolve, reject) => {
    return client.get('trends/place', {id: woeid})
    .then(data => {
      resolve(data[0].trends.map(trend => {
        return {name: trend.name, tweet_volume: trend.tweet_volume}
      }))
    }).catch(reject)
  })
}

/**
 * Gets trends for all locations specified in config.locationsTracking. Returns
 * a promise that resolves with an object mapping country codes to arrays
 * of trending topics for that location.
 *
 * @param  {Object} countryCodes Object mapping country codes to woeids
 * @return {Promise} Promise that resolves with a mapping of country codes to arrays of trending topics
 */
function getLocationTrends (countryCodes) {
  return new Promise((resolve, reject) => {
    let fufilled = 0

    const locationTrends = {}

    config.locationsTracking.forEach(woeid => {
      getTrendsForLocation(woeid).then(trends => {
        locationTrends[countryCodes[woeid]] = trends

        fufilled++
        if (fufilled === config.locationsTracking.length) {
          resolve(locationTrends)
        }
      }).catch(reject)
    })
  })
}

/**
 * Takes an array of worldwide trending topics and an object mapping country
 * codes to trending topics and returns an array of worldwide trending topics
 * each containing a location array
 *
 * @param  {type} worldwideTrends Array of worldwide trends
 * @param  {type} locationTrends Object mapping country codes to arrays of trending topics
 * @return {Array} Array of worldwide trending topics
 */
function reduceTrends (worldwideTrends, locationTrends) {
  const trendsToTrack = []
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

  return trendsToTrack
}

module.exports = trends
