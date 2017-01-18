mongoose = require('mongoose')

var articleSchema = new mongoose.Schema({
  trend: String,
  title: String,
  description: String,
  source: String,
  link: String,
  timeStamp: Number
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article
