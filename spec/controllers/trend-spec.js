const mocks = require('../mocks')
const httpMocks = require('node-mocks-http')
const Trend = require('../../src/models/trend')
const mongoose = require('mongoose')
const mockgoose = require('mockgoose')
const trendController = require('../../src/controllers/trend')

function getResponse () {
  return httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  })
}

var mockTrend

describe('Trend Controller', () => {
  mockTrend = mocks.getMockTrend()

  beforeAll(function (done) {
    // Wrap mongoose with mockgoose
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/testdb', err => {
        if (err) throw err
        // Clear the database
        mockgoose.reset(() => {
          // Insert the mock trend
          Trend.collection.insert([mockTrend], (err, docs) => {
            if (err) throw err
            done()
          })
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

  it('Should return with status 200 for a valid request', done => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: mockTrend.name
      },
      url: '/v1/trend/test-trend'
    })
    let res = getResponse()

    res.on('end', () => {
      expect(res.statusCode).toEqual(200)
      done()
    })

    trendController(req, res)
  })

  it('Should return with status 400 if no trend is specified', done => {
    let req = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/trend/test-trend'
    })
    let res = getResponse()

    res.on('end', () => {
      expect(res.statusCode).toEqual(400)
      done()
    })

    trendController(req, res)
  })

  it('Should return with status 404 if a nonexistant trend is specified', done => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: 'trend-that-does-not-exist'
      },
      url: '/v1/trend/test-trend'
    })
    let res = getResponse()

    res.on('end', () => {
      expect(res.statusCode).toEqual(404)
      done()
    })

    trendController(req, res)
  })

  it('Should return valid JSON', done => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: mockTrend.name
      },
      url: '/v1/trend/test-trend'
    })
    let res = getResponse()

    res.on('end', () => {
      expect(res._isJSON()).toEqual(true)
      done()
    })

    trendController(req, res)
  })

  it('Should return all data for the trend', done => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: mockTrend.name
      },
      url: '/v1/trend/test-trend'
    })
    let res = getResponse()

    res.on('end', () => {
      let data = JSON.parse(res._getData())

      let fields = [
        'name',
        'rank',
        'tweets_analyzed',
        'sentiment_score',
        'sentiment_description',
        'locations',
        'tweet_volume',
        'tweets',
        'articles'
      ]
      fields.forEach(field => {
        expect(data[field]).toBeDefined()
      })

      done()
    })

    trendController(req, res)
  })
})
