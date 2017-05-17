const apiKeys = require('../src/api-keys')


describe('Api Keys Module', () => {
  it('Should return if all api-keys are set with verify()', () => {
    apiKeys.twitterConsumerKey = ''
    apiKeys.twitterConsumerSecret = ''
    apiKeys.twitterAccessTokenKey = ''
    apiKeys.twitterAccessTokenSecret = ''

    expect(apiKeys.verify()).toEqual(false)

    apiKeys.twitterConsumerKey = 'some_key'
    apiKeys.twitterConsumerSecret = 'some_key'
    apiKeys.twitterAccessTokenKey = 'some_key'

    expect(apiKeys.verify()).toEqual(false)

    apiKeys.twitterAccessTokenSecret = 'some_key'

    expect(apiKeys.verify()).toEqual(true)
  })
})
