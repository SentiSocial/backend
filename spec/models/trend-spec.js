'use strict'
const Trend = require('../../src/models/trend')
const mongoose = require('mongoose')
const mockgoose = require('mockgoose')

describe('Trend', function () {
  beforeEach((done) => {
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/testdb', (err) => {
        mockgoose.reset(() => {
          done(err)
        })
      })
    })
  })

  it('Saves a trend and retreives it', (done) => {
    let trendModel = new Trend({
      name: 'test-trend',
      sentiment_score: 3.8,
      sentiment_description: 'Positive',
      locations: ['ca', 'us'],
      tweet_volume: 30000,
      tweets: [
        {embed_id: '23432234'}
      ],
      articles: [
        {
          title: 'Some Article',
          description: 'Description Here',
          source: 'CNN',
          link: 'http://cnn.com',
          timestamp: 1232352352,
          media: 'http://cnn.com/image.jpg'}
      ]
    })

    // Save the trend
    trendModel.save((err) => {
      expect(err).toBeNull()

      // Try to find the trend after saving
      Trend.findOne({name: 'test-trend'}, (err, doc) => {
        expect(err).toBeNull()

        expect(doc).toBeDefined()
        done()
      })
    })
  })
})
