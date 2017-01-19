const Tweet = require('../models/tweet')
const config = require('../config')

const specificTweetsController = function (req, res) {
  res.set('Access-Control-Allow-Origin', '*')

  if (!req.params.name) {
    res.status(400).send('Invalid trend name')
    return
  }

  let query
  if (!req.query.max_id) {
    query = {trend: req.params.name}
  } else {
    options = {trend: req.params.name, _id: {$gt: res.query.max_id}}
  }

  Tweet.find(query, (err, tweets) => {
    if (err) {
      res.status(500).send('Internal error while retreiving tweets')
    } else {
      res.type('application/json')
      res.send(tweets)
    }
  }).limit(config.tweetsPerRequest)
}

module.exports = specificTweetsController
