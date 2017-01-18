const httpMocks = require('node-mocks-http')
const mockery = require('mockery')

describe('All Articles Controller', () => {

  var controller
  var mockArticles = [{
    trend: 'test-trend',
    title: 'title',
    description: 'description',
    source: 'nyt',
    link: 'https://nytimes.com',
    timeStamp: 123456,
    _id: 123456
  }]

  beforeAll (function() {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    })

    mockery.registerMock('../models/article', {
      find: (query, cb) => {
        cb(null, mockArticles)
      }
    })

    controller = require('../../js/controllers/all-articles')
  })

  it('Should return the all articles', () => {
    let req  = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/alltrends/articles'
    })
    let res = httpMocks.createResponse()

    controller(req, res)

    expect(res.statusCode).toEqual(200)
    expect(res._isEndCalled()).toEqual(true)
    expect(res._isJSON()).toEqual(true)

    let data = JSON.parse(res._getData())

    expect(data.articles.length).toEqual(mockArticles.length)
    expect(data.articles[0].trend).toEqual(mockArticles[0].trend)
    expect(data.articles[0].title).toEqual(mockArticles[0].title)
    expect(data.articles[0].description).toEqual(mockArticles[0].description)
    expect(data.articles[0].source).toEqual(mockArticles[0].source)
    expect(data.articles[0].link).toEqual(mockArticles[0].link)
    expect(data.articles[0]._id).toEqual(mockArticles[0]._id)
  })

  it('Should respond with HTTP 400 if an invalid max_id is provided', () => {
    let req  = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/alltrends/articles',
      query: {
        max_id: 'asdf' // Invalid
      }
    })
    let res = httpMocks.createResponse()

    controller(req, res)

    expect(res.statusCode).toEqual(400)
    expect(res._isEndCalled()).toEqual(true)
  })
})
