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

var keywordSchema = new mongoose.Schema({
  word: String,
  occurences: Number
}, {_id: false})

var trendSchema = new mongoose.Schema({
  name: String,
  rank: Number,
  tracking_since: {type: Number, default: () => {return Math.round(Date.now() / 1000)}},
  tweets_analyzed: Number,
  sentiment_score: Number,
  sentiment_description: String,
  locations: [String],
  tweet_volume: Number,
  keywords: [keywordSchema],
  tweets: [tweetSchema],
  articles: [articleSchema]
})

var Trend = mongoose.model('Trend', trendSchema)

module.exports = Trend
