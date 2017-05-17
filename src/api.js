const express = require('express')
const config = require('../config')
const allTrendsController = require('./controllers/all-trends')
const trendController = require('./controllers/trend')

const api = {
  start: function () {
    return new Promise((resolve, reject) => {
      let app = express()

      app.get('/alltrends', allTrendsController)

      app.get('/trend/:name', trendController)

      app.listen(config.apiPort, () => {
        resolve()
      })
    })
  }
}

module.exports = api
