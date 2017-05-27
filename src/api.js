const express = require('express')
const config = require('../config')
const allTrendsController = require('./controllers/all-trends')
const trendController = require('./controllers/trend')

const api = {
  start: function () {
    return new Promise((resolve, reject) => {
      const app = express()

      app.set('x-powered-by', false)

      app.get('/alltrends', allTrendsController)

      app.get('/trend/:name', trendController)

      app.listen(config.apiPort, () => {
        resolve()
      })
    })
  }
}

module.exports = api
