'use strict'
const Trend = require('../../js/models/trend')
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
      history: [{sentiment: 1, timestamp: 123}]
    })

    // Save the trend
    trendModel.save((err) => {
      expect(err).toBeNull()

      // Try to find the trend after saving
      Trend.find({name: 'test-trend'}, (err, docs) => {
        expect(err).toBeNull()

        expect(docs.length).toEqual(1)
        expect(docs[0].name).toEqual('test-trend')
        done()
      })
    })
  })

  it('Pushes new history to an existing trend', done => {
    let trendModel = new Trend({
      name: 'test-trend',
      history: []
    })

    let newHistoryItem = {sentiment: 1, timestamp: 123}

    trendModel.save(() => {
      Trend.findOneAndUpdate({name: 'test-trend'},
      {$push: {history: newHistoryItem}}, {new: true}, (err, doc) => {
        expect(err).toBeNull()

        expect(doc.name).toEqual('test-trend')
        expect(doc.history.length).toEqual(1)
        expect(doc.history[0].sentiment).toEqual(newHistoryItem.sentiment)
        expect(doc.history[0].timestamp).toEqual(newHistoryItem.timestamp)
        done()
      })
    })
  })

  it('Pushes new history to a nonexistant trend using upsert', (done) => {
    let newHistoryItem = {sentiment: 1, timestamp: 123}

    Trend.findOneAndUpdate({name: 'test-trend'},
      {$push: {history: newHistoryItem}}, {upsert: true, new: true}, (err, doc) => {
        expect(err).toBeNull()

        expect(doc.name).toEqual('test-trend')
        expect(doc.history.length).toEqual(1)
        expect(doc.history[0].sentiment).toEqual(newHistoryItem.sentiment)
        expect(doc.history[0].timestamp).toEqual(newHistoryItem.timestamp)
        done()
      })
  })
})
