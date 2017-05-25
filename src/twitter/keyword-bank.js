'use strict'
const keywordExtractor = require('keyword-extractor')

// Disregard keywords if they match these regexes
const stopRegexes = [
  /http.*/, // Disregard links
  /^rt$|^retweet$/i, // Disregard 'rt' and 'retweet'
  /[^a-zA-z0-9#]/ // Disregard words with any non alphanumeric characters (excluding # for hashtags)
]

/**
 * Constructs a new KeywordBank.
 *
 */
function KeywordBank () {
  let keywords = {}

  /**
   * Add the given text to the KeywordBank. Keywords will be extracted from the
   * text and added to the bank.
   *
   * @param  {String} text Text to extract keywords from and add to the bank
   */
  this.addText = function (text) {
    let extractedKeywords = keywordExtractor.extract(text)

    extractedKeywords.forEach(keyword => {
      if (stopRegexes.some(regex => { return keyword.match(regex) })) {
        return
      }

      if (keywords[keyword]) {
        keywords[keyword]++
      } else {
        keywords[keyword] = 1
      }
    })
  }

  /**
   * Returns a list of the top num keywords in the KeywordBank in the form of an
   * array of objects of the form {word: 'keyword', occurences: number_of_occurences}
   *
   * @param  {Number} num Number of keywords to return
   * @return {Array} Array of objects containing keywords and occurences
   */
  this.getTopKeywords = function (num) {
    // Turn keywords into an array, and sort
    let keywordArray = Object.keys(keywords).map(keyword => {
      return {word: keyword, occurences: keywords[keyword]}
    })

    keywordArray.sort((a, b) => {
      return b.occurences - a.occurences
    })
    return keywordArray.slice(0, num)
  }
}

module.exports = KeywordBank
