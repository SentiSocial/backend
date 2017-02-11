const mongoose = require('mongoose')
const mockgoose = require('mockgoose')
const Trend = require('../../src/models/trend')
const mainUtils = require('../../src/utils/main-utils')

mongoose.Promise = global.Promise

describe('Main utils', () => {
  beforeAll(done => {
    // Wrap mongoose with mockgoose
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/testdb', (err) => {
        done(err)
      })
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
      getMockTrend(),
      getMockTrend(),
      getMockTrend()
    ]

    mockTrends[0].name = '#trend1'
    mockTrends[1].name = '#trend2'
    mockTrends[2].name = '#trend3'

    storeMockTrends(mockTrends, () => {
      // Remove #trend3 from the database
      mainUtils.removeOldTrends(['#trend1', '#trend2'], () => {
        getAllTrends((trends) => {
          // #trend3 should no longer exist
          expect(trends.length).toEqual(2)
          expect(trends[0].name).toEqual('#trend1')
          expect(trends[1].name).toEqual('#trend2')
          done()
        })
      })
    })
  })
})

/**
 * Stores all mock trends specified in trends to the database. Calls cb when
 * finished.
 *
 * @param {Array} trends Array of trends
 */
function storeMockTrends (mockTrends, cb) {
  Trend.collection.insert(mockTrends, (err, docs) => {
    if (err) {
      throw err
    }
    cb()
  })
}

/**
 * Gets all current trends from the database and calls cb with them.
 *
 * @param {Function} cb Callback to be called with the array of trends
 * @return {type}  description
 */
function getAllTrends (cb) {
  Trend.find({}, (err, docs) => {
    if (err) {
      throw err
    }
    cb(docs)
  })
}

/**
 * Returns a mock trend object for testing.
 *
 * @return {Object} a mock trend
 */
function getMockTrend () {
  return {
    name: '#trend',
    id: '123456',
    history: [{timestamp: 100, popularity: 5}]
  }
}
