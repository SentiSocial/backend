const Article = require('../models/article')
const config = require('../config')
const mongoose = require('mongoose')

const specificArticlesController = function (req, res) {
  res.set('Access-Control-Allow-Origin', '*')

  if (!req.params.name) {
    res.status(400).send('Invalid trend name')
    return
  }

  // Build the MongoDB query
  let query
  if (!req.query.max_id) {
    query = {trend: req.params.name}
  } else {
    var maxOid = mongoose.Types.ObjectId(req.query.max_id)
    query = {trend: req.params.name, _id: {$lt: maxOid}}
  }

  // Compute number of articles to return
  let limit = parseInt(req.query.limit, 10)
  limit = isNaN(limit) ? config.articlesPerRequest : limit

  Article.find(query, (err, articles) => {
    if (err) {
      res.status(500).send('Internal error while retreiving articles')
    } else {
      let resData = {articles: articles}
      res.json(resData)
    }
  }).limit(limit).sort({_id: -1})
}

module.exports = specificArticlesController
