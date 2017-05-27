'use strict'
const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
  embed_id: String
}, {_id: false})

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  source: String,
  link: String,
  timestamp: Number,
  media: String
}, {_id: false})

const keywordSchema = new mongoose.Schema({
  word: String,
  occurences: Number
}, {_id: false})

const trendSchema = new mongoose.Schema({
  name: String,
  rank: Number,
  tracking_since: {type: Number, default: () => { return Math.round(Date.now() / 1000) }},
  tweets_analyzed: Number,
  sentiment_score: Number,
  sentiment_description: String,
  locations: [String],
  tweet_volume: Number,
  keywords: [keywordSchema],
  tweets: [tweetSchema],
  articles: [articleSchema]
})

const Trend = mongoose.model('Trend', trendSchema)

module.exports = Trend
