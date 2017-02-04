const httpMocks = require('node-mocks-http')
const Trend = require('../../src/models/trend')
const mongoose = require('mongoose')
const mockgoose = require('mockgoose')
const allTrendsController = require('../../src/controllers/all-trends')

function getRequest () {
  return httpMocks.createRequest({
    method: 'GET',
    url: '/v1/alltrends'
  })
}

function getResponse () {
  return httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  })
}

describe('All Trends Controller', () => {
  var mockTrends = [
    new Trend({
      name: 'test-trend1',
      sentiment: 4
    }),
    new Trend({
      name: 'test-trend2',
      sentiment: -1
    })
  ]

  beforeAll(function (done) {
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

  afterAll((done) => {
    mongoose.unmock(() => {
      done()
    })
  })

  it('Should return with status 200 for a valid request', done => {
    let req = getRequest()
    let res = getResponse()

    res.on('end', () => {
      expect(res.statusCode).toEqual(200)
      done()
    })

    allTrendsController(req, res)
  })

  it('Should return valid JSON', done => {
    let req = getRequest()
    let res = getResponse()

    res.on('end', () => {
      expect(res._isJSON()).toEqual(true)
      done()
    })

    allTrendsController(req, res)
  })

  it('Should return all current trends', done => {
    let req = getRequest()
    let res = getResponse()

    res.on('end', () => {
      let data = JSON.parse(res._getData())
      expect(data.trends.length).toEqual(mockTrends.length)
      done()
    })
    allTrendsController(req, res)
  })

  it('Should return all data for each trend', done => {
    let req = getRequest()
    let res = getResponse()

    res.on('end', () => {
      let data = JSON.parse(res._getData())

      let fields = ['name', 'sentiment']
      data.trends.forEach(trend => {
        fields.forEach(field => {
          expect(trend[field]).toBeDefined()
        })
      })

      done()
    })
    allTrendsController(req, res)
  })
})
