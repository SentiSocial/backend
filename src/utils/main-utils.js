'use strict'
const _ = require('underscore')
const Trend = require('../models/trend')
const news = require('../news/news')
const tweetSearch = require('../twitter/tweet-search')
const config = require('../config')

/**
 * Contains utilities used in the main module
 */
const mainUtils = {
  /**
   * Removes all trends from the database not located in the currTrends array.
   *
   * @param  {Array} currTrends Array of trend names (as strings) that are still trending, trends not in this array will be removed from the db
   */
  removeOldTrends: function (currTrends) {
    return new Promise((resolve, reject) => {
      Trend.remove({name: {$nin: currTrends}})
      .then(resolve)
      .catch(error => { reject(error) })
    })
  },

  /**
   * Update the trends in the database. Should be passed an array of trends
   * that are currently trending, and a TweetStream object that has been tracking
   * all trends currently in the database for the past server interval.
   *
   * @param  {Array} trends Array of trend objects that are currently trending
   * @param  {Object} tweetStream TweetStream object that has been tracking trends currently in the db for the past server interval
   */
  update: function (trends, tweetStream) {
    let trendNames = trends.map(trend => { return trend.name })

    let streamData = tweetStream.getData()

    // Remove all old trends
    mainUtils.removeOldTrends(trendNames)

    // Fill in other trend info
    trends.forEach(trendData => {
      news.getNews(trendData.name, newsArticles => {
        tweetSearch.getTweetSample(trendData.name, config.maxTweetsPerTrend)
        .then(tweets => {
          mainUtils.processTrend(trendData, newsArticles, tweets, streamData[trendData.name])
        })
      })
    })
  },

  /**
   * Given a specific trend, update its document in the database with the given
   * information, or create a new document for it if it does not already exist
   * in the database.
   *
   * @param  {Object} trendData Data about the trend returned from the trends module
   * @param  {type} newsArticles Array of news articles for the trend returned from the news module
   * @param  {type} tweets Array of popular tweets for the trend returned from the tweet-search module
   * @param  {type} streamData Data returned from the tweetStream for this trend (can be undefined if the trend just started trending)
   */
  processTrend: function (trendData, newsArticles, tweets, streamData) {
    let fullTrendData = _.extend(trendData, {
      articles: newsArticles,
      tweets: tweets,
      sentiment_score: streamData ? streamData.sentiment : 0,
      tweets_analyzed: streamData ? streamData.tweets_analyzed : 0,
      sentiment_description: 'Not Implemented Yet'
    })

    // Try to find the trend
    Trend.findOne({name: trendData.name})
    .then(doc => {
      // If trend exists
      if (doc) {
        mainUtils.updateExistingTrend(doc, fullTrendData)
      } else {
        mainUtils.createNewTrend(fullTrendData)
      }
    })
  },

  /**
   * Given the existing document for a trend in the db, and newly collected
   * data for a trend, update the trend's data in the db.
   *
   * @param  {Object} existingTrendData MongoDB document already existing in the database for the trend
   * @param  {Object} currentTrendData Object of the same form as existingTrendData, containing new information
   */
  updateExistingTrend: function (existingTrendData, currentTrendData) {
    let newTweetsAnalyzed = existingTrendData.tweets_analyzed + currentTrendData.tweets_analyzed

    // Calculate the new sentiment score (weighting for tweets_analyzed and avoiding dividing by zero)
    let newSentimentScore = newTweetsAnalyzed > 0
      ? (currentTrendData.sentiment_score * currentTrendData.tweets_analyzed +
      existingTrendData.sentiment_score * currentTrendData.tweets_analyzed) /
      newTweetsAnalyzed : 0

    Trend.findOneAndUpdate({name: existingTrendData.name},
      {
        $set: {
          sentiment_score: newSentimentScore,
          tweets_analyzed: newTweetsAnalyzed,
          rank: currentTrendData.rank,
          tweets: currentTrendData.tweets,
          articles: currentTrendData.articles
        }
      })
    .catch(error => { console.error(error) })
  },

  /**
   * Create a new trend in the database.
   *
   * @param  {Object} trendData Data for a trend as specified in the trend model
   */
  createNewTrend: function (trendData) {
    new Trend(trendData).save()
  }
}

module.exports = mainUtils
