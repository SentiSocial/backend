'use strict'
const rewire = require('rewire')
const stream = require('stream')
const TweetStream = rewire('../../src/twitter/tweet-stream.js')

const mockTweetStream = new stream.Readable()
mockTweetStream._read = () => {}
mockTweetStream.destroy = () => {}

// Write a tweet streaming API message to the mock stream
function writeTweetToStream (text) {
  mockTweetStream.emit('data', {text: text})
}

// Write a generic streaming API message to the mock stream
function writeMessageToStream (message) {
  mockTweetStream.emit('data', message)
}

describe('Tweet stream module', () => {
  let tweetStream

  beforeAll(() => {
    TweetStream.__set__('client', {stream: () => { return mockTweetStream }})
  })

  beforeEach(() => {
    tweetStream = new TweetStream()
  })

  it('should receive tweets from the stream', () => {
    tweetStream.startTracking(['trend1', 'trend2'])

    writeTweetToStream('trend1')
    writeTweetToStream('trend2')

    const data = tweetStream.getData()

    expect(data.trend1.tweets_analyzed).toEqual(1)
    expect(data.trend2.tweets_analyzed).toEqual(1)
  })

  it('should return all fields for each trend', () => {
    tweetStream.startTracking(['trend1'])

    writeTweetToStream('trend1')

    const data = tweetStream.getData()

    expect(data.trend1.sentiment).toBeDefined()
    expect(data.trend1.keywords).toBeDefined()
    expect(data.trend1.tweets_analyzed).toBeDefined()
  })

  it('should destroy the stream when closeStream is called', () => {
    spyOn(mockTweetStream, 'destroy')

    tweetStream.startTracking(['trend1'])

    tweetStream.closeStream()

    expect(mockTweetStream.destroy).toHaveBeenCalled()
  })

  it('should log errors', () => {
    spyOn(console, 'error')

    writeTweetToStream('Some tweet text')

    mockTweetStream.emit('error')

    expect(console.error).toHaveBeenCalled()
  })

  it('should log warnings from the streaming API', () => {
    spyOn(console, 'error')

    writeMessageToStream({warning: { code: 'SOME_WARNING_CODE' }})

    expect(console.error).toHaveBeenCalled()
  })

  it('should disregard non tweet, non warning events', () => {
    const mockEvent = {
      'some_event': {
        'event_property': 'something',
        'another_event_property': 'something_else'
      }
    }

    writeMessageToStream(mockEvent)
    expect(tweetStream.getData()).toEqual({})
  })
})
