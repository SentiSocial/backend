const rewire = require('rewire')
const sentimentUtils = rewire('../../src/utils/sentiment-utils')

describe('Sentiment utils', () => {
  beforeAll(() => {
    const mockConfig = {
      sentimentDescriptions: [{min: 0, max: Infinity, text: 'a'}, {min: -Infinity, max: 0, text: 'b'}]
    }

    sentimentUtils.__set__('config', mockConfig)
  })

  it('should return the proper sentiment description', () => {
    expect(sentimentUtils.getSentimentDescription(1)).toEqual('a')
    expect(sentimentUtils.getSentimentDescription(-1)).toEqual('b')
  })

  it('should return a sentiment description on the edge of 2 sentiment descriptions', () => {
    expect(sentimentUtils.getSentimentDescription(0)).toBeDefined()
  })
})
