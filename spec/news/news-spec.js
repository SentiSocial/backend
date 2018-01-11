'use strict'
const rewire = require('rewire')
const nock = require('nock')
const news = rewire('../../src/news/news')

describe('News module', () => {
  function getMockNews () {
    return {
      'status': 'ok',
      'totalResults': 40694,
      'articles': [
        {
          'source': {
            'id': null,
            'name': 'cnn'
          },
          'author': 'John Smith',
          'title': 'This is the news article title',
          'description': 'This is the news article description',
          'url': 'http://cnn.com/somearticle',
          'urlToImage': 'http://cnn.com/someimage.jpg',
          'publishedAt': '2017-05-24T23:35:37Z'
        },
        {
          'source': {
            'id': null,
            'name': 'cnn'
          },
          'author': 'John Smith II',
          'title': 'This is the another article title',
          'description': 'This is another news article description',
          'url': 'http://cnn.com/somearticle2',
          'urlToImage': 'http://cnn.com/someimage2.jpg',
          'publishedAt': '2017-05-25T23:35:37Z'
        }
      ]
    }
  }

  function setMockNews () {
    nock('https://newsapi.org/v2')
      .get('/everything')
      .query(true)
      .reply(200, getMockNews())
  }

  afterEach(() => {
    nock.cleanAll()
  })

  it('should return news with all required fields', done => {
    setMockNews()
    news.getNews('News article').then(articles => {
      const mockArticle = getMockNews().articles[0]
      expect(articles[0]).toEqual(jasmine.objectContaining({
        title: mockArticle.title,
        description: mockArticle.description,
        source: mockArticle.source.name,
        link: mockArticle.url,
        media: mockArticle.urlToImage
      }))

      expect(articles[0].timestamp).toBeDefined()
      done()
    }).catch(error => fail(error))
  })

  it('should return news whose title matches the keyword', done => {
    setMockNews()
    news.getNews('title').then(articles => {
      expect(articles[0]).toBeDefined()
      done()
    }).catch(error => fail(error))
  })

  it('should reject the promise if request encounters an error', done => {
    // Set all newsapi requests to return an error
    nock('https://newsapi.org/v2')
    .persist()
    .get('/everything')
    .query(true)
    .replyWithError('Some error')

    news.getNews('News article').then(articles => {
      fail()
    }).catch(_ => done())
  })

  it('should reject the promise if the returned data has an error newsapi status', done => {
    // Set all newsapi requests to return an error
    nock('https://newsapi.org/v2')
      .persist()
      .get('/everything')
      .query(true)
      .reply(200, {
        status: 'error',
        code: 'somecode',
        message: 'This is a test error'
      })

    news.getNews('News article').then(articles => {
      fail()
    }).catch(_ => done())
  })
})
