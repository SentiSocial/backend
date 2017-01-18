const Trend = require('../models/trend')

const allTrendsController = function (req, res) {
  Trend.find({}, (err, trends) => {
    if (err) {
      res.status(500).send('Internal error while retreiving trend information')
    } else {
      res.type('application/json')
      res.send(trends)
    }
  })
}

module.exports = allTrendsController
