var express = require('express')

var api = function (getTrends, getSpecificTrend, getContent, getSpecificContent) {
  var app = express()

  app.get('/v1/trends', function (req, res) {
    res.send(JSON.stringify(getTrends()))
  })

  app.get('/v1/trends/:id', function (req, res) {
    getSpecificTrend(req.params.id, function(trendInfo) {
      res.send(JSON.stringify(trendInfo))
    })
  })

  app.get('/v1/content', function (req, res) {
    var content = getContent(parseInt(req.query.page))
    res.send(JSON.stringify(content))
  })

  app.get('/v1/content/:id', function (req, res) {
    getSpecificContent(req.params.id, parseInt(req.query.page), function(popularTweets) {
      res.send(JSON.stringify(popularTweets))
    })
  })

  app.listen(3000, function () {
    console.log('Listening on port 3000')
  })
}

module.exports = api
