const Tweet = require('../models/tweet')
const config = require('../config')

const allTweetsController = function (req, res) {
  let query
  if (!req.query.max_id) {
    query = {}
  } else {
    options = {_id: {$gt: req.query.max_id}}
  }

  Tweet.find(query, (err, tweets) => {
    if (err) {
      res.status(500).send('Internal error while retreiving tweets')
    } else {
      let resData = {tweets: tweets}
      res.json(resData)
    }
  }).limit(config.tweetsPerRequest)
}

module.exports = allTweetsController
