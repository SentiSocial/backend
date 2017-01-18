mongoose = require('mongoose')

var tweetSchema = new mongoose.Schema({
  trend: String,
  id: String,
  popularity: Number
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet
