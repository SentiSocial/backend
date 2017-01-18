mongoose = require('mongoose')

var trendSchema = new mongoose.Schema({
  name: String,
  history: [{sentiment: Number, timeStamp: Number}],
});

trendSchema.methods.addHistory = function (newHistoryItem) {
    this.history.push(newHistoryItem)
}

var Trend = mongoose.model('Trend', trendSchema);

module.exports = Trend
