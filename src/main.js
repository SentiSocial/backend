'use strict'
const mongoose = require('mongoose')
const api = require('./api')
const trends = require('./twitter/trends')
const config = require('../config')
const dbUtils = require('./utils/db-utils')
const TweetStream = require('./twitter/tweet-stream')
const tweetSearch = require('./twitter/tweet-search')
const news = require('./news/news')
const apiKeys = require('./api-keys')
const storage = require('node-persist')

mongoose.Promise = global.Promise

if (apiKeys.verify()) {
  start()
} else {
  console.error('Some API keys could not be found, check your enviornment variables')
}

function start () {
  mongoose.connect('mongodb://' + config.dbAddress + '/' + config.dbName)

  var db = mongoose.connection
  db.on('error', console.error)
  db.once('open', () => {
    console.log('Successfully connected to MongoDB server ' + config.dbAddress)

    api.start().then(() => {
      console.log('API Listening on port ' + config.apiPort.toString())
    })

    // Calculate the time to next update based on last_update, then set up updateTrends
    // to be called every config.intervalLength seconds
    storage.initSync()
    let lastUpdateTime = storage.getItemSync('last_update')
    let timeToInitUpdate = lastUpdateTime !== undefined ? config.intervalLength * 1000 - (Date.now() - lastUpdateTime) : 0
    setTimeout(() => {
      updateTrends()
      setInterval(updateTrends, config.intervalLength * 1000)
    }, timeToInitUpdate)
  })
}

var tweetStream = new TweetStream()

/**
 * Function run once every server interval, gets trends from the
 * Twitter API, news from the news API and stores all relavant
 * information in the database.
 *
 */
function updateTrends () {
  storage.setItemSync('last_update', Date.now())

  tweetStream.closeStream()
  let streamData = tweetStream.getData()

  // At the beginning of each interval get all trends
  trends.getTrends()
  // Then update the trend info in the database
  .then(trends => {
    dbUtils.removeOldTrends(trends.map(trendInfo => { return trendInfo.name }))
    trends.forEach(trend => {
      tweetSearch.getTweetSample(trend.name)
      .then(tweets => {
        news.getNews(trend.name)
        .then(news => {
          dbUtils.processTrend(trend, news, tweets, streamData[trend.name])
        })
      })
    })

    // Start tracking the new trends
    tweetStream.startTracking(trends.map(trendData => { return trendData.name }))
  })
}
