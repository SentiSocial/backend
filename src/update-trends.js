'use strict'
var trends = require('./twitter/trends')
var dbUtils = require('./utils/db-utils')
var TweetStream = require('./twitter/tweet-stream')
var tweetSearch = require('./twitter/tweet-search')
var news = require('./news/news')

var tweetStream = new TweetStream()

/**
 * Updates all trends in the database.
 *
 */
function updateTrends () {
  return new Promise((resolve, reject) => {
    tweetStream.closeStream()
    const streamData = tweetStream.getData()

    trends.getTrends()
    .then(trends => {
      // Remove old trends
      dbUtils.removeOldTrends(trends.map(trendInfo => { return trendInfo.name }))

      let trendsProcessed = 0

      // Get data for and process each trend, resolve when all trends processed
      trends.forEach(trend => {
        getDataAndProcess(trend, streamData[trend.name]).then(() => {
          trendsProcessed++
          if (trendsProcessed === trends.length) {
            resolve()
          }
        })
      })

      // Start tracking new trends
      tweetStream.startTracking(trends.map(trendData => { return trendData.name }))
    })
  })
}

/**
 * Gets data for and updates the specified trend. Streaming Data must be
 * provided.
 *
 * @param  {Object} trendInfo Info about trend returned from trends module
 * @param  {Number} trendInfo.name Trend name
 * @param  {Number} trendInfo.rank Trend popularity rank
 *
 * @param  {type}   streamData Info about trend returned from tweet-stream module
 * @param  {Number} streamData.sentiment Sentiment score
 * @param  {Array}  streamData.keywords Keywords related to the trend
 */
function getDataAndProcess (trendInfo, streamData) {
  return new Promise((resolve, reject) => {
    const tweetSearchPromise = tweetSearch.getTweetSample(trendInfo.name)
    const newsPromise = news.getNews(trendInfo.name)

    Promise.all([tweetSearchPromise, newsPromise]).then(values => {
      const tweets = values[0]
      const news = values[1]
      dbUtils.processTrend(trendInfo, news, tweets, streamData).then(resolve)
    })
  })
}

module.exports = updateTrends
