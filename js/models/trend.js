mongoose = require('mongoose')

// Schema representing sentiment at a particular timestamp
// To go in trendSchema's history array
var historyItemSchema = new mongoose.Schema({
  sentiment: Number,
  timestamp: Number
}, {_id: false})

var trendSchema = new mongoose.Schema({
  name: String,
  history: [historyItemSchema],
});

var Trend = mongoose.model('Trend', trendSchema);

module.exports = Trend
