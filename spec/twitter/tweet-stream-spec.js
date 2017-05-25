'use strict'
const rewire = require('rewire')
const stream = require('stream')
const TweetStream = rewire('../../src/twitter/tweet-stream.js')

const mockTweetStream = new stream.Readable()
mockTweetStream._read = () => {}
mockTweetStream.destroy = () => {}

function writeTweetToStream (text) {
  mockTweetStream.emit('data', {text: text})
}

describe('Tweet stream module', () => {
  let tweetStream

  beforeAll(() => {
    TweetStream.__set__('client', {stream: () => { return mockTweetStream }})
  })

  beforeEach(() => {
    tweetStream = new TweetStream()
  })

  it('Should receive tweets from the stream', () => {
    tweetStream.startTracking(['trend1', 'trend2'])

    writeTweetToStream('trend1')
    writeTweetToStream('trend2')

    const data = tweetStream.getData()

    expect(data.trend1.tweets_analyzed).toEqual(1)
    expect(data.trend2.tweets_analyzed).toEqual(1)
  })

  it('Should return all fields for each trend', () => {
    tweetStream.startTracking(['trend1'])

    writeTweetToStream('trend1')

    const data = tweetStream.getData()

    expect(data.trend1.sentiment).toBeDefined()
    expect(data.trend1.keywords).toBeDefined()
    expect(data.trend1.tweets_analyzed).toBeDefined()
  })

  it('Should destroy the stream when closeStream is called', () => {
    spyOn(mockTweetStream, 'destroy')

    tweetStream.startTracking(['trend1'])

    tweetStream.closeStream()

    expect(mockTweetStream.destroy).toHaveBeenCalled()
  })

  it('Should log errors', () => {
    spyOn(console, 'error')

    writeTweetToStream('Some tweet text')

    mockTweetStream.emit('error')

    expect(console.error).toHaveBeenCalled()
  })
})
