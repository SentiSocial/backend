var express = require('express')

var api = function (getTrends, getSpecificTrend, getContent, getSpecificContent) {
  var app = express()

  app.get('/v1/trends', function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')
    res.send(JSON.stringify(getTrends()))
  })

  app.get('/v1/trends/:id', function (req, res) {
    getSpecificTrend(req.params.id, function(trendInfo) {
      res.set('Access-Control-Allow-Origin', '*')
      res.send(JSON.stringify(trendInfo))
    })
  })

  app.get('/v1/content', function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')
    var content = getContent(parseInt(req.query.page))
    console.log(content)
    res.send(JSON.stringify(content))
  })

  app.get('/v1/content/:id', function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')
    getSpecificContent(req.params.id, parseInt(req.query.page), function(popularTweets) {
      res.send(JSON.stringify(popularTweets))
    })
  })

  app.listen(8080, function () {
    console.log('Listening on port 8080')
  })
}

module.exports = api
