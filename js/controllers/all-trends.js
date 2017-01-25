const Trend = require('../models/trend')

const allTrendsController = function (req, res) {
  res.set('Access-Control-Allow-Origin', '*')

  Trend.find({}, (err, trends) => {
    if (err) {
      res.status(500).send('Internal error while retreiving trend information')
    } else {
      // Include only the most recent sentiment value in each trend
      let resData = {trends: trends}
      resData.trends = resData.trends.map((trend) => {
        return {
          name: trend.name,
          sentiment: trend.sentiment = trend.history.length > 0 ?
            trend.history[trend.history.length-1].sentiment : 0
        }
      })
      res.json(resData)
    }
  })
}

module.exports = allTrendsController
