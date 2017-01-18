const Article = require('../models/article')

const allArticlesController = function (req, res) {
  let query
  if (!req.query.max_id) {
    query = {}
  } else {
    options = {_id: {$gt: res.query.max_id}}
  }

  Article.find(query, (err, articles) => {
    if (err) {
      res.status(500).send('Internal error while retreiving tweets')
    } else {
      res.type('application/json')
      res.send(articles)
    }
  })
}

module.exports = allArticlesController
