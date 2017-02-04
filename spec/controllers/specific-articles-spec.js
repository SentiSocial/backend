const httpMocks = require('node-mocks-http')
const specificArticlesController = require('../../src/controllers/specific-articles')
const mongoose = require('mongoose')
const mockgoose = require('mockgoose')
const Article = require('../../src/models/article')

describe('Specific Articles Controller', () => {
  // Fake article data
  var mockArticles = [
    new Article({
      trend: 'test-trend',
      title: 'title1',
      description: 'description1',
      source: 'nyt',
      media: 'https://nytimes.com/someimage.jpg',
      link: 'https://nytimes.com',
      timestamp: 1234567,
      _id: 123888
    }),
    new Article({
      trend: 'test-trend',
      title: 'title2',
      description: 'description2',
      source: 'nyt',
      media: 'https://nytimes.com/someimage.jpg',
      link: 'https://nytimes.com',
      timestamp: 1234567,
      _id: 12345678
    })
  ]

  beforeAll((done) => {
    // Wrap mongoose with mockgoose
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/testdb', (err) => {
        if (err) throw err
        // Clear the database
        mockgoose.reset(() => {
          // Insert all our mock articles
          Article.collection.insert(mockArticles, (err, docs) => {
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

  it('Should return with status 200 for a valid request', (done) => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: 'test-trend'
      },
      url: '/v1/trend/test-trend/articles'
    })

    let res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })

    res.on('end', () => {
      expect(res.statusCode).toEqual(200)
      done()
    })

    specificArticlesController(req, res)
  })

  it('Should return with status 400 for a request with no trend name', (done) => {
    let req = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/trend/test-trend/articles'
    })

    let res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })

    res.on('end', () => {
      expect(res.statusCode).toEqual(400)
      done()
    })

    specificArticlesController(req, res)
  })

  it('Should return valid JSON', (done) => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: 'test-trend'
      },
      url: '/v1/trend/test-trend/articles'
    })

    let res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })

    specificArticlesController(req, res)

    res.on('end', () => {
      expect(res._isJSON()).toEqual(true)
      done()
    })
  })

  it('Should return fewer articles if a limit is specified', (done) => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: 'test-trend'
      },
      query: {
        limit: '1'
      },
      url: '/v1/trend/test-trend/articles'
    })

    let res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })

    res.on('end', () => {
      let data = JSON.parse(res._getData())

      expect(data.articles.length).toEqual(1)
      done()
    })

    specificArticlesController(req, res)
  })

  it('Should return articles having the correct data', (done) => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: 'test-trend'
      },
      url: '/v1/trend/test-trend/articles'
    })

    let res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })

    res.on('end', () => {
      let data = JSON.parse(res._getData())
      // Verify that all fields are returned and defined
      let fields = ['trend', 'title', 'description', 'source', 'media', 'link', 'timestamp', '_id']
      mockArticles.forEach((article, index) => {
        fields.forEach(field => {
          expect(data.articles[index][field]).toBeDefined()
        })
      })
      done()
    })

    specificArticlesController(req, res)
  })
})
