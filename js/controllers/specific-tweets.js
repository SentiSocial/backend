const Tweet = require('../models/tweet')
const controllerUtils = require('./controller-utils')

const specificTweetsController = function (req, res) {
  if (!req.params.name) {
    res.status(400).send('Invalid trend name')
    return
  }

  let query
  if (!req.query.max_id) {
    query = {trend: req.params.name}
  } else {
    // If max_id is provided, ensure that it is valid
    if(!controllerUtils.isNumeric(req.query.max_id)) {
      res.status(400).send('Invalid max_id parameter')
      return
    }
    options = {trend: req.params.name, _id: {$gt: res.query.max_id}}
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

module.exports = specificTweetsController
