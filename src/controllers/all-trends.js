const Trend = require('../models/trend')

const allTrendsController = function (req, res) {
  res.set('Access-Control-Allow-Origin', '*')

  Trend.find({}, (err, trends) => {
    if (err) {
      res.status(500).send('Internal error while retreiving trend information')
    } else {
      let resData = {trends: trends}
      res.json(resData)
    }
  }).select({name: 1, sentiment_score: 1, _id: 0})
}

module.exports = allTrendsController
