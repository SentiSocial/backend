const Tweet = require('../models/tweet')
const config = require('../config')
const mongoose = require('mongoose')

const allTweetsController = function (req, res) {
  res.set('Access-Control-Allow-Origin', '*')

  let query
  if (!req.query.max_id) {
    query = {}
  } else {
    var max_oid = mongoose.Types.ObjectId(req.query.max_id)
    query = {trend: req.params.name, _id: {$lt: max_oid}}
  }

  Tweet.find(query, (err, tweets) => {
    if (err) {
      res.status(500).send('Internal error while retreiving tweets')
    } else {
      let resData = {tweets: tweets}
      res.json(resData)
    }
  }).sort({_id: -1}).limit(config.tweetsPerRequest)
}

module.exports = allTweetsController
