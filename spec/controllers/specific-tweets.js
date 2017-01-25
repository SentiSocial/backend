const httpMocks = require('node-mocks-http')
const mockery = require('mockery')

describe('Specific Tweets Controller', () => {
  var controller
  var mockTweets = [{
    embedId: '123456789',
    _id: '1234abcdef'
  }]

  beforeAll(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    })

    mockery.registerMock('../models/tweet', {
      find: (query, cb) => {
        cb(null, mockTweets)
        return {limit: () => {}}
      }
    })

    controller = require('../../src/controllers/specific-tweets')
  })

  it('Should return the all tweets', () => {
    let req = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/alltrends/tweets'
    })
    let res = httpMocks.createResponse()

    controller(req, res)

    expect(res.statusCode).toEqual(200)
    expect(res._isEndCalled()).toEqual(true)
    expect(res._isJSON()).toEqual(true)

    let data = JSON.parse(res._getData())

    expect(data.tweets.length).toEqual(mockTweets.length)
    expect(data.tweets[0].id).toEqual(mockTweets[0].id)
    expect(data.tweets[0]._id).toEqual(mockTweets[0]._id)
  })
})
