'use strict'
const mongoose = require('mongoose')
const api = require('./src/api')
const config = require('./config')
const apiKeys = require('./src/api-keys')
const storage = require('node-persist')
const updateTrends = require('./src/update-trends')

// Mongoose's promise library is deprecated so plug in ES6 promises
mongoose.Promise = global.Promise

// Verify that all API keys are present and start the backend
if (apiKeys.verify()) {
  start()
} else {
  console.error('Some API keys could not be found, check your enviornment variables')
}

/**
 * Starts the backend
 *
 */
function start () {
  mongoose.connect('mongodb://' + config.dbAddress + '/' + config.dbName)

  const db = mongoose.connection

  db.on('error', console.error)

  db.once('open', () => {
    console.log('Successfully connected to MongoDB server ' + config.dbAddress)

    api.start().then(() => {
      console.log('API Listening on port ' + config.apiPort.toString())
    })

    storage.initSync()
    const timeToInitUpdate = getTimeToNextUpdate()

    setTimeout(() => {
      updateTrends()
      setInterval(() => {
        storage.setItemSync('last_update', Date.now())
        updateTrends()
      }, config.intervalLength * 1000)
    }, timeToInitUpdate)
  })
}

/**
 * Returns the time to the next update in milliseconds.
 *
 * @return {Number} Time to next server update in milliseconds
 */
function getTimeToNextUpdate () {
  const lastUpdateTime = storage.getItemSync('last_update')

  if (lastUpdateTime !== undefined) {
    config.intervalLength * 1000 - (Date.now() - lastUpdateTime)
  } else {
    return 0
  }
}
