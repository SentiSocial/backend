const express = require('express')
const config = require('./config')
const allTrendsController = require('./controllers/all-trends')
const allTweetsController = require('./controllers/all-tweets')
const allArticlesController = require('./controllers/all-articles')
const specificTrendController = require('./controllers/specific-trend')
const specificTweetsController = require('./controllers/specific-tweets')
const specificArticlesController = require('./controllers/specific-articles')


const api = {
  start: function () {
    let app = express()

    app.get('/v1/alltrends', allTrendsController)

    app.get('/v1/alltrends/tweets', allTweetsController)

    app.get('/v1/alltrends/articles', allArticlesController)

    app.get('/v1/trend/:name', specificTrendController)

    app.get('/v1/trend/:name/tweets', specificTweetsController)

    app.get('/v1/trend/:name/articles', specificArticlesController)

    app.listen(config.apiPort, () => {
      console.log('Api listening on port ' + config.apiPort.toString())
    })
  }
}

module.exports = api
