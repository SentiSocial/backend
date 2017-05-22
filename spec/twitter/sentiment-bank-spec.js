'use strict'
const SentimentBank = require('../../src/twitter/sentiment-bank')
const sentiment = require('sentiment')

describe('SentimentBank', () => {
  it('Correctly calculates an average with 1 tweet', () => {
    let sentimentBank = new SentimentBank()
    let tweetText = 'This is a great string with a positivie mood'
    sentimentBank.addText(tweetText)

    let sen = sentiment(tweetText)

    expect(sentimentBank.getSentiment()).toEqual(sen.score)
  })

  it('Correctly calculates an average with multiple tweets', () => {
    let sentimentBank = new SentimentBank()

    let string1 = 'This is a great string with a positivie mood'
    let string2 = 'This is a horrible string with a really awful mood'
    let string3 = 'This string is absolutely euphoric'

    let sen1 = sentiment(string1)
    let sen2 = sentiment(string2)
    let sen3 = sentiment(string3)

    let averageSen = (sen1.score + sen2.score + sen3.score) / 3

    sentimentBank.addText(string1)
    sentimentBank.addText(string2)
    sentimentBank.addText(string3)

    expect(sentimentBank.getSentiment()).toEqual(averageSen)
  })

  it('Ignores all words occuring in the trend name', () => {
    let trendName = 'Bad Horrible trend name with negative sentiment'
    let sentimentBank = new SentimentBank(trendName)

    sentimentBank.addText('Bad Horrible Negative')

    expect(sentimentBank.getSentiment()).toEqual(0)
  })
})
