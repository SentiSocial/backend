const rewire = require('rewire')
const mocks = require('../mocks')
const httpMocks = require('node-mocks-http')
const Trend = require('../../src/models/trend')
const mongoose = require('mongoose')
const mockgoose = require('mockgoose')
const allTrendsController = rewire('../../src/controllers/all-trends')

function getRequest () {
  return httpMocks.createRequest({
    method: 'GET',
    url: '/alltrends'
  })
}

function getResponse () {
  return httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  })
}

var mockTrends

describe('All Trends Controller', () => {
  mockTrends = [
    mocks.getMockTrend(),
    mocks.getMockTrend()
  ]

  mockTrends[0].rank = 1
  mockTrends[1].rank = 2

  beforeAll(done => {
    // Wrap mongoose with mockgoose
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/testdb', err => {
        if (err) throw err
        // Clear the database
        mockgoose.reset(() => {
          // Insert all our mock trends
          Trend.collection.insert(mockTrends, (err, docs) => {
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

  it('should return with status 200 for a valid request', done => {
    const req = getRequest()
    const res = getResponse()

    res.on('end', () => {
      expect(res.statusCode).toEqual(200)
      done()
    })

    allTrendsController(req, res)
  })

  it('should return status 500 for an internal server error', done => {
    // Mock trend model that calls the callback to find() with an error
    const trendMock = {find: (query, callback) => {
      callback(new Error('Some error'), {})
      return {select: () => {
        return {sort: () => {}}
      }}
    }}

    const req = getRequest()
    const res = getResponse()

    allTrendsController.__with__({
      Trend: trendMock
    })(() => {
      res.on('end', () => {
        expect(res.statusCode).toEqual(500)
        done()
      })

      allTrendsController(req, res)
    })
  })

  it('should return valid JSON', done => {
    const req = getRequest()
    const res = getResponse()

    res.on('end', () => {
      expect(res._isJSON()).toEqual(true)
      done()
    })

    allTrendsController(req, res)
  })

  it('should return all current trends', done => {
    const req = getRequest()
    const res = getResponse()

    res.on('end', () => {
      const data = JSON.parse(res._getData())
      expect(data.trends.length).toEqual(mockTrends.length)
      done()
    })
    allTrendsController(req, res)
  })

  it('should return all data for each trend', done => {
    const req = getRequest()
    const res = getResponse()

    res.on('end', () => {
      const data = JSON.parse(res._getData())

      const fields = ['name', 'sentiment_score', 'rank']
      data.trends.forEach(trend => {
        fields.forEach(field => {
          expect(trend[field]).toBeDefined()
        })
      })

      done()
    })
    allTrendsController(req, res)
  })

  it('should return trends sorted by rank', done => {
    const req = getRequest()
    const res = getResponse()

    res.on('end', () => {
      const data = JSON.parse(res._getData())

      expect(data.trends[0].rank).toBeLessThan(data.trends[1].rank)

      done()
    })
    allTrendsController(req, res)
  })
})
