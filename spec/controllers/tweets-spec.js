const httpMocks = require('node-mocks-http')
const tweetsController = require('../../src/controllers/tweets')
const mongoose = require('mongoose')
const mockgoose = require('mockgoose')
const Tweet = require('../../src/models/tweet')

describe('Tweets Controller', () => {
  // Fake tweet data
  var mockTweets = [
    new Tweet({
      trend: 'test-trend',
      embed_id: '123456789',
      popularity: 2
    }),
    new Tweet({
      trend: 'test-trend',
      embed_id: '12345678',
      popularity: 3
    })
  ]

  beforeAll((done) => {
    // Wrap mongoose with mockgoose
    mockgoose(mongoose).then(() => {
      mongoose.connect('mongodb://example.com/testdb', (err) => {
        if (err) throw err
        // Clear the database
        mockgoose.reset(() => {
          // Insert all our mock tweets
          Tweet.collection.insert(mockTweets, (err, docs) => {
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
      url: '/v1/trend/test-trend/tweets'
    })

    let res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })

    res.on('end', () => {
      expect(res.statusCode).toEqual(200)
      done()
    })

    tweetsController(req, res)
  })

  it('Should return with status 400 for a request with no trend name', (done) => {
    let req = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/trend/test-trend/tweets'
    })

    let res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })

    res.on('end', () => {
      expect(res.statusCode).toEqual(400)
      done()
    })

    tweetsController(req, res)
  })

  it('Should return valid JSON', (done) => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: 'test-trend'
      },
      url: '/v1/trend/test-trend/tweets'
    })

    let res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })

    tweetsController(req, res)

    res.on('end', () => {
      expect(res._isJSON()).toEqual(true)
      done()
    })
  })

  it('Should return fewer tweets if a limit is specified', (done) => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: 'test-trend'
      },
      query: {
        limit: '1'
      },
      url: '/v1/trend/test-trend/tweets'
    })

    let res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })

    res.on('end', () => {
      let data = JSON.parse(res._getData())

      expect(data.tweets.length).toEqual(1)
      done()
    })

    tweetsController(req, res)
  })

  it('Should return tweets having the correct data', (done) => {
    let req = httpMocks.createRequest({
      method: 'GET',
      params: {
        name: 'test-trend'
      },
      url: '/v1/trend/test-trend/tweets'
    })

    let res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })

    res.on('end', () => {
      let data = JSON.parse(res._getData())
      // Verify that all fields are returned and defined
      let fields = ['trend', 'embed_id', 'popularity']
      mockTweets.forEach((tweet, index) => {
        fields.forEach(field => {
          expect(data.tweets[index][field]).toBeDefined()
        })
      })
      done()
    })

    tweetsController(req, res)
  })
})
