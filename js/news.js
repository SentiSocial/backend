'use strict'
var apiKeys = require('./api-keys')
var config = require('./config')
var sources = require('./sources.json')
var request = require('request')

/**
 * Contains function that gets an arrray of news articles using the News API
 *
 * @author suchaHassle
 * @param  {String} trend Trend word to search for news articles in the API
 * @param  {Function} callback Callback with an array objects(news articles)
 */
var getNews = function (trend, callback) {
  var responses = []
  var completedRequests = 0

  // Iterate through each source configured by sources.json file
  sources.source.forEach(function (source, index) {
    var currentSource = source.id
    var link = config.rootNewsApiLink + 'v1/articles?source=' + currentSource + '&apiKey=' + apiKeys.newsApiKey

    // JSON request for the articles from the source
    request(link, function (error, response, body) {
      response = JSON.parse(response.body)

      if (!error) {
        for (var article in response.articles) {
          // Ignore all articles that contain null
          if (response.articles[article].description !== null && response.articles[article].title !== null) {
            // Checks for whether the article contains the trending keyword
            if (response.articles[article].description.toLowerCase().indexOf(trend.toLowerCase()) !== -1 ||
              response.articles[article].title.toLowerCase().indexOf(trend.toLowerCase()) !== -1) {
              // Adds the news object to the list of articles
              responses.push(createNewObject(response.articles[article], source.name))
            }
          }
        }

        completedRequests++
        if (completedRequests === sources.source.length) {
          // Filter the articles down to the max cap
          if (responses.length > config.maxArticlesStorageCap) {
            responses = pickArticles(responses)
          }
          // Callback to save to database
          callback(responses)
        }
      }
    })
  })
}

/**
 * pickArticles - Selects articles based on popularity of the a news source
 *
 * @author suchaHassle
 * @param  {Array} articles An array of objects for all news articles
 * @return {Array} An array of objects for the top news articles capped at configured amount
 */
function pickArticles (articles) {
  var count = 0
  var finalArticles = []

  // Iterate through the list of the sort news sources
  for (var i = 0; i < config.sources.length; i++) {
    // Add all articles from said news source
    for (var j = 0; j < articles.length; j++) {
      if (articles[j].source === config.sources[i]) {
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

 /**
  * createNewObject - Creates a news object to formatted requirements for endpoint
  *
  * @param  {Object} article Object containing all information of the article
  * @param  {String} sourceName Name of the source for that article
  * @return {Object} Return news article object in appropriate format
  */
function createNewObject (article, sourceName) {
  var obj = {
    title: article.title,
    timestamp: parseInt(new Date(article.publishedAt).getTime()) / 1000,
    source: sourceName,
    link: article.url,
    description: article.description
  }
  return obj
}

module.exports = getNews
