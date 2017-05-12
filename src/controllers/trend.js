const Trend = require('../models/trend')

const trendController = function (req, res) {
  res.set('Access-Control-Allow-Origin', '*')

  if (!req.params.name) {
    res.status(400).send('Invalid trend name')
    return
  }

  Trend.findOne({name: req.params.name}, (err, trend) => {
    if (err) {
      res.status(500).send('Internal error while retreiving trend information')
    } else if (!trend) {
      res.status(404).send('Trend not found')
    } else {
      res.json(trend)
    }
  }).select({_id: 0, __v: 0})
}

module.exports = trendController
