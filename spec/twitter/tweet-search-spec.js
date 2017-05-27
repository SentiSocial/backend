const nock = require('nock')
const tweetSearch = require('../../src/twitter/tweet-search')

describe('Tweet Search Module', () => {
  beforeEach(() => {
    const mockTweetData = {
      statuses: []
    }

    for (let i = 0; i < 100; i++) {
      mockTweetData.statuses.push(
        {
          'text': 'This is tweet 2 #test',
          'id_str': '123456789',
          'retweet_count': 5,
          'favourites_count': 9
        }
      )
    }

    nock('https://api.twitter.com/1.1')
    .get('/search/tweets.json')
    .query(true)
    .reply(200, mockTweetData)
  })

  it('should return at least the specified number of tweets', done => {
    tweetSearch.getTweetSample('#test', 20).then(tweets => {
      expect(tweets.length >= 20).toEqual(true)
      done()
    })
  })

  it('should return tweets with the correct fields', done => {
    tweetSearch.getTweetSample('#test', 5).then(tweets => {
      tweets.forEach(tweet => {
        expect(tweet.embed_id).toBeDefined()
      })
      done()
    })
  })
})
