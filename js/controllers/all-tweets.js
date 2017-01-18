const Tweet = require('../models/tweet')

const allTweetsController = function (req, res) {
  let query
  if (!req.query.max_id) {
    query = {}
  } else {
    options = {_id: {$gt: res.query.max_id}}
  }

  Tweet.find(query, (err, tweets) => {
    if (err) {
      res.status(500).send('Internal error while retreiving tweets')
    } else {
      res.type('application/json')
      res.send(tweets)
    }
  })
}

module.exports = allTweetsController
