const Article = require('../models/article')
const config = require('../config')
const mongoose = require('mongoose')

const specificArticlesController = function (req, res) {
  res.set('Access-Control-Allow-Origin', '*')

  if (!req.params.name) {
    res.status(400).send('Invalid trend name')
    return
  }

  let query
  if (!req.params.max_id) {
    query = {trend: req.params.name}
  } else {
    var max_oid = mongoose.Types.ObjectId(req.query.max_id)
    query = {trend: req.params.name, _id: {$lt: max_oid}}
  }

  console.log(query)

  Article.find(query, (err, articles) => {
    if (err) {
      res.status(500).send('Internal error while retreiving tweets')
    } else {
      let resData = {articles: articles}
      res.json(resData)
    }
  }).sort({_id: -1}).limit(config.articlesPerRequest)
}

module.exports = specificArticlesController
