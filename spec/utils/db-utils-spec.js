'use strict'
const mocks = require('../mocks')
const mongoose = require('mongoose')
const mockgoose = require('mockgoose')
const Trend = require('../../src/models/trend')
const dbUtils = require('../../src/utils/db-utils')

mongoose.Promise = global.Promise

describe('Main utils', () => {
  beforeAll(done => {
    // Wrap mongoose with mockgoose
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/testdb', err => {
        done(err)
      })
    })
  })

  afterAll(done => {
    mockgoose.reset(() => {
      mongoose.connection.close()
      done()
    })
  })

  afterEach(done => {
    // Clear all collections from mockgoose
    mockgoose.reset(() => {
      done()
    })
  })

  it('Should remove all old trends from the database with removeOldTrends', done => {
    let mockTrends = [
      mocks.getMockTrend(),
      mocks.getMockTrend(),
      mocks.getMockTrend()
    ]

    mockTrends[0].name = '#trend1'
    mockTrends[1].name = '#trend2'
    mockTrends[2].name = '#trend3'

    storeMockTrends(mockTrends).then(() => {
      // Remove #trend3 from the database
      dbUtils.removeOldTrends(['#trend1', '#trend2']).then(() => {
        getAllTrends().then(trends => {
          // #trend3 should no longer exist
          expect(trends.length).toEqual(2)
          expect(trends[0].name).toEqual('#trend1')
          expect(trends[1].name).toEqual('#trend2')
          done()
        })
      })
    })
  })

  it('Should add a new trend with createTrend', done => {
    let trend = mocks.getMockTrend()

    dbUtils.createNewTrend(trend).then(() => {
      getAllTrends().then(trends => {
        expect(trends.length).toEqual(1)
        done()
      })
    })
  })

  it('Should update an existing trend with updateExistingTrend', done => {
    let existingTrendData = mocks.getMockTrend()
    let currentTrendData = mocks.getMockTrend()

    currentTrendData.rank = 3
    currentTrendData.articles = [
      {
        title: 'new articles',
        description: 'A new Article',
        source: 'http://cnn.com',
        link: 'http://cnn.com/article',
        timestamp: 1494573005,
        media: 'http://cnn.com/image.jpg'
      }
    ]
    currentTrendData.tweets = [
      { embed_id: '111111' },
      { embed_id: '222222' }
    ]
    currentTrendData.sentiment_score = -2
    currentTrendData.tweets_analyzed = 5

    currentTrendData.keywords = [
      {word: 'word1', occurences: 10}
    ]
    existingTrendData.keywords = [
      {word: 'word2', occurences: 4}
    ]

    let trendModel = Trend(existingTrendData)

    trendModel.save().then(() => {
      dbUtils.updateExistingTrend(existingTrendData, currentTrendData).then(() => {
        Trend.findOne({}).then(doc => {
          // Rank should be copied from currentTrendData
          expect(doc.rank).toEqual(currentTrendData.rank)

          // Articles should be replaced
          doc.articles.forEach((article, i) => {
            expect(article).toEqual(jasmine.objectContaining(currentTrendData.articles[i]))
          })

          // Tweets should be replaced
          doc.tweets.forEach((tweet, i) => {
            expect(tweet).toEqual(jasmine.objectContaining(currentTrendData.tweets[i]))
          })

          // Keywords arrays should be merged and sorted
          expect(doc.keywords[0]).toEqual(jasmine.objectContaining({word: 'word1', occurences: 10}))
          expect(doc.keywords[1]).toEqual(jasmine.objectContaining({word: 'word2', occurences: 4}))

         // Tweets analyzed should be summed up
          let totalTweetsAnalyzed = currentTrendData.tweets_analyzed + existingTrendData.tweets_analyzed
          expect(doc.tweets_analyzed).toEqual(totalTweetsAnalyzed)

          // Sentiment should be properly averaged weighting for tweets_analyzed
          let sentimentAvg = (currentTrendData.sentiment_score * currentTrendData.tweets_analyzed +
            existingTrendData.sentiment_score * existingTrendData.tweets_analyzed) / totalTweetsAnalyzed

          expect(doc.sentiment_score).toEqual(sentimentAvg)

          done()
        })
      })
    })
  })

  it('Should call createNewTrend when processTrend is called with a new Trend', done => {
    spyOn(dbUtils, 'createNewTrend').and.returnValue({then: () => {
      expect(dbUtils.createNewTrend).toHaveBeenCalled()
      done()
    }})

    dbUtils.processTrend(mocks.getMockTrend(), [], [])
  })

  it('Should call updateExistingTrend when processTrend is called with an existing Trend', done => {
    let trend = mocks.getMockTrend()
    let trendModel = new Trend(trend)

    spyOn(dbUtils, 'updateExistingTrend').and.returnValue({then: () => {
      expect(dbUtils.updateExistingTrend).toHaveBeenCalled()

      done()
    }})

    trendModel.save().then(() => {
      dbUtils.processTrend(trend, [], [])
    })
  })
})

/**
 * Stores all mock trends specified in trends to the database. Returns a
 * promise
 *
 * @param {Array} trends Array of trends
 */
function storeMockTrends (mockTrends, cb) {
  return new Promise((resolve, reject) => {
    Trend.collection.insert(mockTrends).then(docs => {
      resolve()
    }).catch(reject)
  })
}

/**
 * Gets all current trends from the database. Returns a promise.
 *
 * @param {Function} cb Callback to be called with the array of trends
 * @return {Promise} Promise resolved after trends are retreived
 */
function getAllTrends (cb) {
  return new Promise((resolve, reject) => {
    Trend.find({}).then(docs => {
      resolve(docs)
    }).catch(reject)
  })
}
