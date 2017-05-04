const tweetUtils = require('../../src/utils/tweet-utils')

describe('Tweet Utils', () => {
  it('Should properly sort tweets by popularity using sortTweets', () => {
    let tweets = [
      {
        text: 'tweet1',
        id: '123456',
        popularity: 1
      },
      {
        text: 'tweet2',
        id: '123456',
        popularity: 3
      },
      {
        text: 'tweet3',
        id: '123456',
        popularity: 2
      }
    ]
    tweetUtils.sortTweets(tweets)

    expect(tweets[0].popularity).toEqual(1)
    expect(tweets[1].popularity).toEqual(2)
    expect(tweets[2].popularity).toEqual(3)
  })
})
