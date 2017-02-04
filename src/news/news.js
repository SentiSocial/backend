'use strict'
const request = require('request')

const newsApi = 'http://newsapi.org'
const apiKey = require('../api-keys').newsApiKey
const config = require('../config.js')
const sources = require('./sources.json')
const maxArticles = config.maxArticlesStorageCap

/**
 * Transforms camel cased sentences to a spaced spaced sentence.
 * "thisIsAnExample" -> "this Is An Example"
 * "hiOCAreMyInitials" -> "hi OC Are My Initials"
 * "ABCNews" -> "ABC News"
 * "CNN" -> "CNN"
 * @param  {string} string
 * @return {string}
 * @author Omar Chehab
 */
function camelCaseToSpaced (string) {
  return string
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
}

/**
 * Replaces hyphens with spaces.
 * "this_is_an_example" -> "this is an example"
 * "what-about-dashes" -> "what about dashes"
 * @param  {sting} string
 * @return {sting}
 * @author Omar Chehab
 */
function unHyphenate (string) {
  return string
    .replace(/[_-]/g, ' ')
}

/**
 * Adds ? after all matches
 * @param  {string} substring  what to make optional from string
 * @param  {string} string
 * @return {string}
 * @author Omar Chehab
 */
function optionalize (substring, string, flags) {
  flags = flags || 'g'
  return string
    .replace(new RegExp(`(${substring})`, flags), '$1?')
}

/**
 * Generates a regular expression that leniently match a given string
 * @param  {string} string
 * @param  {string} flags  optional
 * @return {RegExp}
 * @author Omar Chehab
 */
function generateFuzzyPattern (string, flags) {
  flags = flags || 'i'
  string = camelCaseToSpaced(string)
  string = unHyphenate(string)
  string = optionalize('[#@ ]', string)
  return new RegExp(string, flags)
}

/**
 * Retrieves relevant news using NewsAPI.org given a phrase.
 * @param  {string}   phrase
 * @param  {function} callback
 * @author Omar Chehab
 */
function getNews (phrase, callback) {
  if (!apiKey) {
    throw Error('News Module requires an API key from NewsAPI.org')
  }

  let articles = []
  let pending = sources.length

  const pattern = generateFuzzyPattern(phrase)

  sources.forEach(source => searchForArticlesFromSource(pattern, source,
   (error, response) => {
     pending--
     if (error) {
       console.error(`Request to ${source} failed`, error)
       return
     }

     articles = articles.concat(response)
     if (!pending) respond()
   })
  )

  function respond () {
    callback(reduceArticles(articles))
  }
}

/**
 * Requests NewsAPI.org for articles from a given source and returns an array of
 * articles that matches a given RegExp pattern.
 * @param  {RegExp}   pattern   describing what to find
 * @param  {string}   source    newsapi.org source id
 * @param  {function} callback  callback should be a function with two
 *                              parameters.
 *                              First parameter is error.
 *                              Second parameter is articles.
 * @author Omar Chehab
 */
function searchForArticlesFromSource (pattern, source, callback) {
  const url = `${newsApi}/v1/articles?source=${source.id}&apiKey=${apiKey}`
  let articles = []

  request(url, (error, response) => {
    if (error) {
      callback(error)
      return
    }

    response = JSON.parse(response.body)

    if (response.status !== 'ok') {
      const message = `NewsAPI returned status ${response.status} `
      callback(new Error(message))
      return
    }

    response.articles.forEach(article => {
      const title = article.title
      const titleMatches = title && pattern.test(title)
      const description = article.description
      const descriptionMatches = description && pattern.test(description)

      if (titleMatches || descriptionMatches) {
        const timestamp = new Date(article.publishedAt).getTime() / 1000
        articles.push({
          title: title,
          description: description,
          timestamp: timestamp,
          source: source.name,
          link: article.url,
          media: article.urlToImage
        })
      }
    })

    callback(undefined, articles)
  })
}

/**
 * pickArticles - Selects articles based on popularity of the a news source
 *
 * @author suchaHassle
 * @param  {Array} articles An array of objects for all news articles
 * @return {Array} An array of objects for the top news articles capped at configured amount
 */
function reduceArticles (articles) {
  if (articles.length <= maxArticles) {
    return articles
  }

  var count = 0
  var finalArticles = []

  // Iterate through the list of the sort news sources
  for (var i = 0; i < config.sources.length; i++) {
    // Add all articles from said news source
    for (var j = 0; j < articles.length; j++) {
      if (articles[j].id === config.sources[i]) {
        finalArticles.push(articles[j])
        count++
      }
      // Return if we've reached max cap
      if (count === config.maxArticlesStorageCap) {
        return finalArticles
      }
    }
  }
}

module.exports = getNews
// For scalability reasons, change the statement above to the statement below
// Do not forget to change news (...) to news.getNews (...) in js/main.js
/*
module.exports = {
  getNews: getNews,
}
*/
