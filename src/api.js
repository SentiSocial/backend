const express = require('express')
const config = require('./config')
const allTrendsController = require('./controllers/all-trends')
const trendController = require('./controllers/trend')
const tweetsController = require('./controllers/tweets')
const articlesController = require('./controllers/articles')

const api = {
  start: function () {
    let app = express()

    app.get('/v1/alltrends', allTrendsController)

    app.get('/v1/trend/:name', trendController)

    app.get('/v1/trend/:name/tweets', tweetsController)

    app.get('/v1/trend/:name/articles', articlesController)

    app.listen(config.apiPort, () => {
      console.log('Api listening on port ' + config.apiPort.toString())
    })
  }
}

module.exports = api
