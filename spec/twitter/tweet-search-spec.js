const nock = require('nock')
const tweetSearch = require('../../src/twitter/tweet-search')

describe('Twitter Trends Module', () => {
  beforeEach(() => {
    let mockTweetData = {
      statuses: [
        {
          'text': 'This is tweet 1 #test',
          'id_str': '123456789',
          'retweet_count': 4,
          'favourites_count': 2
        },
        {
          'text': 'This is tweet 2 #test',
          'id_str': '123456789',
          'retweet_count': 5,
          'favourites_count': 9
        },
        {
          'text': 'This is tweet 3 #test',
          'id_str': '123456789',
          'retweet_count': 1,
          'favourites_count': 0
        }
      ]
    }

    nock('https://api.twitter.com/1.1')
    .persist(true)
    .get('/search/tweets.json')
    .query(true)
    .reply(200, mockTweetData)
  })

  it('Should return at least the specified number of tweets', done => {
    tweetSearch.getTweetSample('#test', 20, tweets => {
      expect(tweets.length >= 20).toEqual(true)
      done()
    })
  })

  it('Should return tweets with the correct fields', done => {
    tweetSearch.getTweetSample('#test', 5, tweets => {
      tweets.forEach(tweet => {
        expect(tweet.id).toBeDefined()
        expect(tweet.text).toBeDefined()
        expect(tweet.popularity).toBeDefined()
      })
      done()
    })
  })
})
