const httpMocks = require('node-mocks-http')
const mockery = require('mockery')

describe('All Trends Controller', () => {
  var controller
  var mockTrends = [{
    name: '#thisIsATrend',
    history: [{sentiment: 5, timestamp: 22}]
  }]

  beforeAll(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    })

    mockery.registerMock('../models/trend', {
      find: (query, cb) => {
        cb(null, mockTrends)
      }
    })

    controller = require('../../js/controllers/all-trends')
  })

  it('Should return the all trends', () => {
    let req = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/alltrends'
    })
    let res = httpMocks.createResponse()

    controller(req, res)

    expect(res.statusCode).toEqual(200)
    expect(res._isEndCalled()).toEqual(true)
    expect(res._isJSON()).toEqual(true)

    let data = JSON.parse(res._getData())
    expect(data.trends.length).toEqual(mockTrends.length)
    expect(data.trends[0].name).toEqual(mockTrends[0].name)

    // The sentiment value returned should be the last sentiment value in the
    // history array
    let lastSentimentValue = mockTrends[0].history[mockTrends[0].history.length - 1].sentiment
    expect(data.trends[0].sentiment).toEqual(lastSentimentValue)
  })
})
