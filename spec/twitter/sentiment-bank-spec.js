'use strict'
const SentimentBank = require('../../src/twitter/sentiment-bank')
const sentiment = require('sentiment')

describe('SentimentBank', () => {
  it('Correctly calculates an average with 1 tweet', () => {
    const sentimentBank = new SentimentBank()
    const tweetText = 'This is a great string with a positivie mood'
    sentimentBank.addText(tweetText)

    const sen = sentiment(tweetText)

    expect(sentimentBank.getSentiment()).toEqual(sen.score)
  })

  it('Correctly calculates an average with multiple tweets', () => {
    const sentimentBank = new SentimentBank()

    const string1 = 'This is a great string with a positivie mood'
    const string2 = 'This is a horrible string with a really awful mood'
    const string3 = 'This string is absolutely euphoric'

    const sen1 = sentiment(string1)
    const sen2 = sentiment(string2)
    const sen3 = sentiment(string3)

    const averageSen = (sen1.score + sen2.score + sen3.score) / 3

    sentimentBank.addText(string1)
    sentimentBank.addText(string2)
    sentimentBank.addText(string3)

    expect(sentimentBank.getSentiment()).toEqual(averageSen)
  })

  it('Ignores all words occuring in the trend name', () => {
    const trendName = 'Bad Horrible trend name with negative sentiment'
    const sentimentBank = new SentimentBank(trendName)

    sentimentBank.addText('Bad Horrible Negative')

    expect(sentimentBank.getSentiment()).toEqual(0)
  })
})
