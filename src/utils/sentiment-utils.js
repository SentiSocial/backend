'use strict'
var config = require('../config')

var sentimentUtils = {

  /**
   * Get a human readable description of the given sentiment score
   *
   * @param  {Number} score Sentiment score to get a description for
   * @return {String} Human readable description of the given sentiment score
   */
  getSentimentDescription: function (score) {
    return config.sentimentDescriptions.find(descrip => {
      if (descrip.max >= score && descrip.min <= score) {
        return descrip.text
      }
    }).text
  }
}

module.exports = sentimentUtils
