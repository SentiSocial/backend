'use strict'
const rewire = require('rewire')
const nock = require('nock')
const news = rewire('../../src/news/news')

describe('News module', () => {
  const newsMock = {
    'status': 'ok',
    'source': 'cnn',
    'sortBy': 'latest',
    'articles': [
      {
        'author': 'John Smith',
        'title': 'This is a news article',
        'description': 'This is, in fact, a news article',
        'url': 'http://cnn.com/somearticle',
        'urlToImage': 'http://cnn.com/someimage.jpg',
        'publishedAt': '2017-05-24T23:35:37Z'
      }
    ]
  }

  beforeAll(() => {
    nock('https://newsapi.org/v1')
    .get('/articles')
    .query(true)
    .reply(200, newsMock)

    // Ensure the module only requests from CNN
    news.__set__('sources', [{id: 'cnn'}])
  })

  it('Should return news with all required fields', done => {
    news.getNews('News article').then(articles => {
      const mockArticle = newsMock.articles[0]
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
})
