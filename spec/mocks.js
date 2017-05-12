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
      tweets_analyzed: 100,
      sentiment_score: 3,
      sentiment_description: 'Positive',
      locations: ['US', 'CA'],
      tweet_volume: 12345,
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
  }
}

module.exports = mocks
