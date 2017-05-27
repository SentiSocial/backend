'use strict'
const request = require('request')
const newsUtils = require('../utils/news-utils')

const newsApiBaseUrl = 'https://newsapi.org/v1'
const apiKey = require('../api-keys').newsApiKey
const config = require('../../config.js')
var sources = require('./sources.json')

const news = {
  /**
   * Retrieves relevant news using NewsAPI.org given a phrase. Returns a promise.
   *
   * @param  {String} phrase Phrase to search for
   */
  getNews: function (phrase) {
    return new Promise((resolve, reject) => {
      let articles = []
      let pending = sources.length

      const pattern = newsUtils.generateFuzzyPattern(phrase)

      sources.forEach(source => searchForArticlesFromSource(pattern, source)
        .then(response => {
          pending--

          articles = articles.concat(response)
          if (pending === 0) {
            resolve(articles.slice(0, config.maxArticlesPerTrend))
          }
        }).catch(error => {
          console.error(error)
          pending--
          if (pending === 0) {
            resolve(articles.slice(0, config.maxArticlesPerTrend))
          }
        })
      )
    })
  }
}

/**
 * Requests NewsAPI.org for articles from a given source. Returns a promise
 * that resolves with a list of news articles
 *
 * @param  {RegExp} pattern describing what to find
 * @param  {String} source newsapi.org source id
 */
function searchForArticlesFromSource (pattern, source) {
  return new Promise((resolve, reject) => {
    const url = `${newsApiBaseUrl}/articles?source=${source.id}&apiKey=${apiKey}`
    const articles = []

    request(url, (error, response) => {
      if (error) {
        reject(error)
        return
      }

      const responseJson = JSON.parse(response.body)

      if (responseJson.status !== 'ok') {
        reject(new Error(responseJson.status))
        return
      }

      responseJson.articles.forEach(article => {
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
      resolve(articles)
    })
  })
}

module.exports = news
