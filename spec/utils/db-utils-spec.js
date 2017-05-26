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
    const mockTrends = [
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
    const trend = mocks.getMockTrend()

    dbUtils.createNewTrend(trend).then(() => {
      getAllTrends().then(trends => {
        expect(trends.length).toEqual(1)
        done()
      })
    })
  })

  it('Should update trend rank with updateExistingTrend', done => {
    const existingTrendData = mocks.getMockTrend()
    const currentTrendData = mocks.getMockTrend()

    existingTrendData.rank = 1
    currentTrendData.rank = 2

    const trendModel = Trend(existingTrendData)

    trendModel.save().then(() => {
      dbUtils.updateExistingTrend(existingTrendData, currentTrendData).then(() => {
        Trend.findOne({}).then(doc => {
          expect(doc.rank).toEqual(2)
          done()
        })
      })
    })
  })

  it('Should update trend articles with updateExistingTrend', done => {
    const existingTrendData = mocks.getMockTrend()
    const currentTrendData = mocks.getMockTrend()

    existingTrendData.articles = []
    currentTrendData.articles = [mocks.getMockArticle()]

    const trendModel = Trend(existingTrendData)

    trendModel.save().then(() => {
      dbUtils.updateExistingTrend(existingTrendData, currentTrendData).then(() => {
        Trend.findOne({}).then(doc => {
          expect(doc.articles.length).toEqual(1)
          done()
        })
      })
    })
  })

  it('Should update trend tweets with updateExistingTrend', done => {
    const existingTrendData = mocks.getMockTrend()
    const currentTrendData = mocks.getMockTrend()

    existingTrendData.tweets = []
    currentTrendData.tweets = [mocks.getMockTweet()]

    const trendModel = Trend(existingTrendData)

    trendModel.save().then(() => {
      dbUtils.updateExistingTrend(existingTrendData, currentTrendData).then(() => {
        Trend.findOne({}).then(doc => {
          expect(doc.tweets.length).toEqual(1)
          done()
        })
      })
    })
  })

  it('Should update trend tweets analyzed with updateExistingTrend', done => {
    const existingTrendData = mocks.getMockTrend()
    const currentTrendData = mocks.getMockTrend()

    existingTrendData.tweets_analyzed = 1
    currentTrendData.tweets_analyzed = 1

    const trendModel = Trend(existingTrendData)

    trendModel.save().then(() => {
      dbUtils.updateExistingTrend(existingTrendData, currentTrendData).then(() => {
        Trend.findOne({}).then(doc => {
          expect(doc.tweets_analyzed).toEqual(2)
          done()
        })
      })
    })
  })

  it('Should update trend sentiment score with updateExistingTrend', done => {
    const existingTrendData = mocks.getMockTrend()
    const currentTrendData = mocks.getMockTrend()

    existingTrendData.sentiment_score = 5
    currentTrendData.sentiment_score = 2

    existingTrendData.tweets_analyzed = 6
    currentTrendData.tweets_analyzed = 8

    const totalTweetsAnalyzed = existingTrendData.tweets_analyzed + currentTrendData.tweets_analyzed

    const trendModel = Trend(existingTrendData)

    trendModel.save().then(() => {
      dbUtils.updateExistingTrend(existingTrendData, currentTrendData).then(() => {
        Trend.findOne({}).then(doc => {
          // Sentiment should be properly averaged weighting for tweets_analyzed
          const sentimentAvg = (currentTrendData.sentiment_score * currentTrendData.tweets_analyzed +
            existingTrendData.sentiment_score * existingTrendData.tweets_analyzed) / totalTweetsAnalyzed

          expect(doc.sentiment_score).toBeCloseTo(sentimentAvg, 3)
          done()
        })
      })
    })
  })

  it('Should update trend keywords with updateExistingTrend', done => {
    const existingTrendData = mocks.getMockTrend()
    const currentTrendData = mocks.getMockTrend()

    currentTrendData.keywords = [
      {word: 'word1', occurences: 10}
    ]
    existingTrendData.keywords = [
      {word: 'word2', occurences: 4}
    ]

    const trendModel = Trend(existingTrendData)

    trendModel.save().then(() => {
      dbUtils.updateExistingTrend(existingTrendData, currentTrendData).then(() => {
        Trend.findOne({}).then(doc => {
          // Keywords arrays should be merged and sorted
          expect(doc.keywords[0]).toEqual(jasmine.objectContaining({word: 'word1', occurences: 10}))
          expect(doc.keywords[1]).toEqual(jasmine.objectContaining({word: 'word2', occurences: 4}))

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
    const trend = mocks.getMockTrend()
    const trendModel = new Trend(trend)

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
