'use strict'
const mongoose = require('mongoose')
const api = require('./api')
const trends = require('./twitter/trends')
const config = require('./config')
const dbUtils = require('./utils/db-utils')
const TweetStream = require('./twitter/tweet-stream')
const tweetSearch = require('./twitter/tweet-search')
const news = require('./news/news')

mongoose.Promise = global.Promise

var db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('Successfully connected to MongoDB server ' + config.dbAddress)

  // Run updateTrends when the backend starts
  updateTrends()

  // Then set up updateTrends to run each server interval
  setInterval(updateTrends, config.intervalLength * 1000)

  api.start().then(() => {
    console.log('API Listening on port ' + config.apiPort.toString())
  })
})
mongoose.connect('mongodb://' + config.dbAddress + '/' + config.dbName)

var tweetStream = new TweetStream()

/**
 * Function run once every server interval, gets trends from the
 * Twitter API, news from the news API and stores all relavant
 * information in the database.
 *
 */
function updateTrends () {
  tweetStream.closeStream()
  let streamData = tweetStream.getData()

  // At the beginning of each interval get all trends
  trends.getTrends()
  // Then update the trend info in the database
  .then(trends => {
    trends.forEach(trend => {
      tweetSearch.getTweetSample(trend.name)
      .then(tweets => {
        news.getNews(trend.name, news => {
          dbUtils.processTrend(trend, news, tweets, streamData[trend.name])
        })
      })
    })

    // Start tracking the new trends
    tweetStream.startTracking(trends.map(trendData => { return trendData.name }))
  })
}
