'use strict'
const rewire = require('rewire')
const nock = require('nock')
const news = rewire('../../src/news/news')

describe('News module', () => {
  function getMockNews (org) {
    return {
      'status': 'ok',
      'source': org,
      'sortBy': 'latest',
      'articles': [
        {
          'author': 'John Smith',
          'title': 'This is the news article title',
          'description': 'This is the news article description',
          'url': 'http://cnn.com/somearticle',
          'urlToImage': 'http://cnn.com/someimage.jpg',
          'publishedAt': '2017-05-24T23:35:37Z'
        }
      ]
    }
  }

  const mockSources = [{id: 'cnn'}, {id: 'bbc-news'}]

  function setMockSources () {
    mockSources.forEach(source => {
      nock('https://newsapi.org/v1')
      .get('/articles')
      .query(query => {
        return query.source === source.id
      })
      .reply(200, getMockNews(source.id))
    })
  }

  beforeAll(() => {
    // Ensure the module only requests from sources in mockSources
    news.__set__('sources', mockSources)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('Should return news with all required fields', done => {
    setMockSources()

    news.getNews('News article').then(articles => {
      const mockArticle = getMockNews().articles[0]
      expect(articles[0]).toEqual(jasmine.objectContaining({
        title: mockArticle.title,
        description: mockArticle.description,
        source: mockArticle.source,
        link: mockArticle.url,
        media: mockArticle.urlToImage
      }))

      expect(articles[0].timestamp).toBeDefined()
      done()
    }).catch(error => fail(error))
  })

  it('Should return news whose title matches the keyword', done => {
    setMockSources()

    news.getNews('title').then(articles => {
      expect(articles[0]).toBeDefined()
      done()
    }).catch(error => fail(error))
  })

  it('Should return news whose description matches the keyword', done => {
    setMockSources()

    news.getNews('description').then(articles => {
      expect(articles[0]).toBeDefined()
      done()
    }).catch(error => fail(error))
  })

  it('Should log an error if the promise if request encounters an error', done => {
    // Set all newsapi requests to return an error
    nock('https://newsapi.org/v1')
    .persist()
    .get('/articles')
    .query(true)
    .replyWithError('Some error')

    spyOn(console, 'error')

    news.getNews('News article').then(articles => {
      expect(console.error).toHaveBeenCalled()
      done()
    }).catch(error => fail(error))
  })

  it('Should log an error if the newsapi returns an error code', done => {
    const mockErrorResponse = {
      'status': 'error',
      'code': 'someErrorCode',
      'message': 'Test Error'
    }

    // Set all newsapi requests to return an error
    nock('https://newsapi.org/v1')
    .persist()
    .get('/articles')
    .query(true)
    .reply(400, mockErrorResponse)

    spyOn(console, 'error')

    news.getNews('News article').then(articles => {
      expect(console.error).toHaveBeenCalled()
      done()
    }).catch(error => fail(error))
  })
})
