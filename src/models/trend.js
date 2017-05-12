'use strict'
const mongoose = require('mongoose')

var tweetSchema = new mongoose.Schema({
  embed_id: String
}, {_id: false})

var articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  source: String,
  link: String,
  timestamp: Number,
  media: String
}, {_id: false})

var trendSchema = new mongoose.Schema({
  name: String,
  rank: Number,
  tweets_analyzed: Number,
  sentiment_score: Number,
  sentiment_description: String,
  locations: [String],
  tweet_volume: Number,
  tweets: [tweetSchema],
  articles: [articleSchema]
})

var Trend = mongoose.model('Trend', trendSchema)

module.exports = Trend
