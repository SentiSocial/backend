const Article = require('../models/article')
const config = require('../config')

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
    options = {trend: req.params.name, _id: {$gt: res.query.max_id}}
  }

  console.log(query)

  Article.find(query, (err, articles) => {
    if (err) {
      res.status(500).send('Internal error while retreiving tweets')
    } else {
      res.type('application/json')
      res.send(articles)
    }
  }).limit(config.articlesPerRequest)
}

module.exports = specificArticlesController
