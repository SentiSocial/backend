'use strict'

const apiKeys = {
  newsApiKey: process.env.NEWS_API_KEY,
  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  twitterAccessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY,
  twitterAccessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,

  /**
   * Returns true if all API keys are set (not empty strings).
   *
   * @return {Boolean} True if all API keys are set, false otherwise
   */
  verify: function () {
    return (apiKeys.newsApiKey !== '') &&
      (apiKeys.twitterConsumerKey !== '') &&
      (apiKeys.twitterConsumerSecret !== '') &&
      (apiKeys.twitterAccessTokenKey !== '') &&
      (apiKeys.twitterAccessTokenSecret !== '')
  }

}

module.exports = apiKeys
