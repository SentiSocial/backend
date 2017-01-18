'use strict'
const Article = require('../../js/models/article')
const mongoose = require('mongoose')
const mockgoose = require('mockgoose')

describe('Article', function () {

  beforeEach((done) => {
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/testdb', (err) => {
        mockgoose.reset(() => {
          done(err)
        })
      })
    })
  })

  it('Saves an article and retreives it', (done) => {
    let articleModel = new Article({
      trend: 'test-trend',
      title: 'Article Title',
      description: 'Article Description',
      source: 'New York Times',
      link: 'https://nytimes.com',
      timeStamp: 123456
    })

    // Save the article
    articleModel.save((err) => {
      expect(err).toBeNull()

      // Try to find the article after saving
      Article.find({trend: 'test-trend'}, (err, docs) => {
        expect(err).toBeNull()

        expect(docs.length).toEqual(1)
        expect(docs[0].trend).toEqual('test-trend')
        done()
      })
    })
  })

  it('Adds a new article if it does not already exist using $setOnInsert' , (done) => {
    let article = {
      trend: 'test-trend',
      title: 'Article Title',
      description: 'Article Description',
      source: 'New York Times',
      link: 'https://nytimes.com',
      timeStamp: 123456
    }

    Article.findOneAndUpdate({link: 'https://nytimes.com'}, {$setOnInsert: article},
      {upsert: true, new: true}, (err, doc) => {
      expect(err).toBeNull()

      expect(doc.trend).toEqual('test-trend')
      expect(doc.title).toEqual('Article Title')
      done()
    })
  })
})
