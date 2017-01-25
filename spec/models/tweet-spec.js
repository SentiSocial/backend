'use strict'
const Tweet = require('../../src/models/tweet')
const mongoose = require('mongoose')
const mockgoose = require('mockgoose')

describe('Tweet', function () {
  beforeEach((done) => {
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/testdb', err => {
        mockgoose.reset(() => {
          done(err)
        })
      })
    })
  })

  it('Saves a Tweet and retreives it', done => {
    let tweetModel = new Tweet({
      trend: 'test-trend',
      embed_id: '123456',
      popularity: 10
    })

    // Save the tweet
    tweetModel.save((err) => {
      expect(err).toBeNull()

      // Try to find the tweet after saving
      Tweet.find({trend: 'test-trend'}, (err, docs) => {
        expect(err).toBeNull()

        expect(docs.length).toEqual(1)
        expect(docs[0].trend).toEqual('test-trend')
        done()
      })
    })
  })

  it('Adds a new tweet if it does not already exist using $setOnInsert', done => {
    let tweet = {
      trend: 'test-trend',
      embed_id: '123',
      popularity: 10
    }

    Tweet.findOneAndUpdate({embed_id: '123'}, {$setOnInsert: tweet}, {upsert: true, new: true}, (err, doc) => {
      expect(err).toBeNull()

      expect(doc.trend).toEqual('test-trend')
      expect(doc.embed_id).toEqual('123')
      expect(doc.popularity).toEqual(10)
      done()
    })
  })
})
