const Article = require('../models/article')

const allArticlesController = function (req, res) {
  let query
  if (!req.query.max_id) {
    query = {}
  } else {
    // If max_id is provided, ensure that it is valid
    if(isNaN(parseFloat(req.query.max_id)) || !isFinite(req.query.max_id)) {
      res.status(400).send('Invalid max_id parameter')
    }
    options = {_id: {$gt: req.query.max_id}}
  }

  Article.find(query, (err, articles) => {
    if (err) {
      res.status(500).send('Internal error while retreiving tweets')
    } else {
      let resData = {articles: articles}
      res.json(resData)
    }
  })
}

module.exports = allArticlesController
