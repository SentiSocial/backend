const news = require('../news/news')
const tweetSearch = require('../twitter/tweet-search')
const TweetSentimentAnalysis = require('../twitter/tweet-sentiment-analysis')
const Trend = require('../models/trend')
const config = require('../config')

/**
 * Contains utilities used in the main module
 */
const mainUtils = {
  /**
   * Removes all trends from the database not in the currTrends array.
   *
   * @param {Array} currTrends Array of trend names to be retained in database
   * @param {type} cb Function to be called when trends have been deleted
   */
  removeOldTrends: function (currTrends, cb) {
    Trend.remove({name: {$nin: currTrends}}, () => {
      cb()
    })
  },

  /**
   * Updates information for all trends in the trends array. Adds new news
   * articles and popular tweets to the database as well as adding a new
   * sentiment score to each trend.
   *
   * @param {Array} trends Array of trend names to update in the database
   */
  updateTrends: function (trends) {
    trends.forEach(function (trend) {
      tweetSearch.getTweetSample(trend, config.popularTweetsRetreivedTotal, tweets => {
        // Get a sentiment score for tweets, and store it in the db
        let sentimentScore = mainUtils.analyzeTweets(trend, tweets)
        mainUtils.storeSentimentInfo(trend, sentimentScore, Date.now())

        // Store the popular tweets from tweets in the db
        mainUtils.storeTweets(trend, tweets)
      })

      // Store news articles
      news.getNews(trend, articles => {
        mainUtils.storeArticles(trend, articles)
      })
    })
  },

  storeSentimentInfo: function (trend, sentimentScore, timestamp) {
    let sentiment = {
      sentiment: sentimentScore,
      timestamp: timestamp
    }

    // Update this trend's sentiment, or create a new trend if this trend doesn't already exist
    Trend.findOneAndUpdate({name: trend}, {$push: {history: sentiment}},
      {upsert: true}, (err, doc) => {
        if (err) {
          console.log('Error updating sentiment information in database')
          throw err
        }
      })
  },

  /**
   * Stores all the given tweets for the given trend in the database.
   *
   * @param {String} trend Trend to store tweets for
   * @param {Array} tweets Tweets to store in the database
   */
  storeTweets: function (trend, tweets) {
    // Add tweets for this trend to the database
    let reducedTweets = tweets.slice(0, config.tweetsStored)
    reducedTweets.forEach((tweet) => {
      let dbTweet = {
        trend: trend,
        embed_id: tweet.id,
        popularity: tweet.popularity
      }

      // Add dbTweet to the database only if it does not already exist in
      // the database
      Tweet.findOneAndUpdate({embed_id: tweet.id}, {$setOnInsert: dbTweet},
        {upsert: true}, (err, doc) => {
          if (err) {
            console.log('Error adding tweet to database')
            throw err
          }
        })
    })
  },

  /**
   * Stores all the given news articles for the given trend in the database.
   *
   * @param {String} trend Name of trend to store articles for
   * @param {Array} articles Array of news articles to store info for
   */
  storeArticles: function (trend, articles) {
    // Get and store news for this trend
    articles.forEach(article => {
      // Object representing this article
      let currArticle = {
        trend: trend,
        title: article.title,
        description: article.description,
        source: article.source,
        media: article.media,
        link: article.link,
        timestamp: article.timestamp
      }

      // Add the article to the db only if it does not alreay exist in the db
      // Note: We don't have a unique ID for news articles, so we use
      // the article title and link as an identifier (Should cover 99.99% of cases)
      Article.findOneAndUpdate({title: article.title, link: article.link}, {$setOnInsert: currArticle}, {upsert: true}, (err, doc) => {
        if (err) {
          console.log('Error adding news article to database')
          throw err
        }
      })
    })
  },

  /**
   * Analyze the sentiment of all tweets in the tweets array and return an
   * integer representing the sentiment score of the tweets.
   *
   * @param {String} trend Trend to store sentiment analysis for
   * @param {Array} tweets Array of tweets to analyze sentiment of
   * @param {String} tweet.text Text of the tweet
   */
  analyzeTweets: function (trend, tweets) {
    // Analyze the sentiment of all tweets in tweets
    let tweetSentimentAnalysis = new TweetSentimentAnalysis()
    tweets.forEach(tweet => {
      tweetSentimentAnalysis.addTweet(tweet.text)
    })

    return tweetSentimentAnalysis.getSentiment()
  }
}

module.exports = mainUtils
