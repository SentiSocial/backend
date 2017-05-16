'use strict'
const mongoose = require('mongoose')
const api = require('./api')
const trends = require('./twitter/trends')
const config = require('./config')
const dbUtils = require('./utils/db-utils')
const TweetStream = require('./twitter/tweet-stream')

mongoose.Promise = global.Promise

// Connect to the db, then set up the intervalFunction
var db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('Successfully connected to mongodb')

  // Run the intervalFunction when the backend starts
  intervalFunction()

  // Then set up intervalFunction to run each server interval
  setInterval(intervalFunction, config.intervalLength * 1000)

  api.start()
})
mongoose.connect('mongodb://' + config.dbAddress + '/' + config.dbName)

/**
 * Function run once every server interval, gets trends from the
 * Twitter API, news from the news API and stores all relavant
 * information in the database.
 *
 */
var tweetStream = new TweetStream()

function intervalFunction () {
  // At the beginning of each interval get all trends
  trends.getTrends()
  // Then update the trend info in the database
  .then(trends => {
    dbUtils.update(trends, tweetStream)

    tweetStream.closeStream()

    tweetStream.startTracking(trends.map(trendData => { return trendData.name }))
  })
}
