'use strict'
const Trend = require('../../src/models/trend')
const mongoose = require('mongoose')
const mockgoose = require('mockgoose')
const mocks = require('../mocks')

describe('Trend', () => {
  beforeEach(done => {
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/testdb', err => {
        mockgoose.reset(() => {
          done(err)
        })
      })
    })
  })

  afterAll(done => {
    mockgoose.reset(() => {
      mongoose.connection.close()
      done()
    })
  })

  it('saves a trend and retreives it', done => {
    const trendModel = new Trend(mocks.getMockTrend())

    // Save the trend
    trendModel.save(err => {
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
