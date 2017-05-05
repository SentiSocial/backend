const express = require('express')
const config = require('./config')
const allTrendsController = require('./controllers/all-trends')
const trendController = require('./controllers/trend')

const api = {
  start: function () {
    let app = express()

    app.get('/v1/alltrends', allTrendsController)

    app.get('/v1/trend/:name', trendController)

    app.listen(config.apiPort, () => {
      console.log('Api listening on port ' + config.apiPort.toString())
    })
  }
}

module.exports = api
