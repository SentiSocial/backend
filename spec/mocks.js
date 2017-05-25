'use strict'
/**
 * Contains functions that return mocks needed for testing
 */
const mocks = {
  /**
   * Returns a mock trend object for testing.
   *
   * @return {Object} a mock trend
   */
  getMockTrend: function () {
    return {
      name: '#trend',
      rank: 2,
      tracking_since: 1494984862585,
      tweets_analyzed: 100,
      sentiment_score: 3,
      sentiment_description: 'Positive',
      locations: ['US', 'CA'],
      tweet_volume: 12345,
      keywords: [
        {word: 'someword', occurences: 12},
        {word: 'someotherword', occurences: 5},
        {word: 'someotherotherword', occurences: 2}
      ],
      tweets: [
        { embed_id: '123456' },
        { embed_id: '123457' }
      ],
      articles: [
        {
          title: 'SomeArticleTitle',
          description: 'An Article',
          source: 'http://cnn.com',
          link: 'http://cnn.com/article',
          timestamp: 1494573005,
          media: 'http://cnn.com/image.jpg'
        }
      ]
    }
  },

  /**
   * Returns a mock article object for testing
   *
   * @return {Object} A mock article
   */
  getMockArticle: function () {
    return {
      title: 'SomeArticleTitle',
      description: 'An Article',
      source: 'http://cnn.com',
      link: 'http://cnn.com/article',
      timestamp: 1494573005,
      media: 'http://cnn.com/image.jpg'
    }
  },

  /**
   * Returns a mock tweet object for testing
   *
   * @return {Object} A mock tweet
   */
  getMockTweet: function () {
    return {
      embed_id: '123456'
    }
  }
}

module.exports = mocks
