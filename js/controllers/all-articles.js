const Article = require('../models/article')
const config = require('../config')

const allArticlesController = function (req, res) {
  let query
  if (!req.query.max_id) {
    query = {}
  } else {
    options = {_id: {$gt: req.query.max_id}}
  }

  Article.find(query, (err, articles) => {
    if (err) {
      res.status(500).send('Internal error while retreiving tweets')
    } else {
      let resData = {articles: articles}
      res.json(resData)
    }
  }).limit(config.articlesPerRequest)
}

module.exports = allArticlesController
