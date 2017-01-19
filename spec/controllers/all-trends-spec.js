const httpMocks = require('node-mocks-http')
const mockery = require('mockery')

describe('All Trends Controller', () => {

  var controller
  var mockTrends = [{
    name: '#thisIsATrend',
    sentiment: 5,
  }]

  beforeAll (function() {
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
    let req  = httpMocks.createRequest({
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
    expect(data.trends[0].history).toEqual(mockTrends[0].history)
  })
})
