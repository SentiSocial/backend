const Article = require('../models/article')
const config = require('../config')
const mongose = require('mongoose')

const allArticlesController = function (req, res) {
  res.set('Access-Control-Allow-Origin', '*')

  let query
  if (!req.query.max_id) {
    query = {}
  } else {
    var max_oid = mongoose.Types.ObjectId(req.query.max_id)
    query = {trend: req.params.name, _id: {$lt: max_oid}}
  }

  Article.find(query, (err, articles) => {
    if (err) {
      res.status(500).send('Internal error while retreiving tweets')
    } else {
      let resData = {articles: articles}
      res.json(resData)
    }
  }).sort({_id: -1}).limit(config.articlesPerRequest)
}

module.exports = allArticlesController
