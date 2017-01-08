'use strict'
var TweetSentimentAnalysis = require('../js/tweet-sentiment-analysis')
var sentiment = require('sentiment')

describe("tweetSentimentAnalysis", function () {
  var tweetSentimentAnalysis

  beforeEach(function() {
    tweetSentimentAnalysis = new TweetSentimentAnalysis()
  })

  it("Correctly calculates an average with 1 tweet", function () {
    var tweetText = 'This is a great string with a positivie mood'
    tweetSentimentAnalysis.addTweet(tweetText)

    var sen = sentiment(tweetText)

    expect(tweetSentimentAnalysis.getSentiment()).toEqual(sen.score)
  });

  it("Correctly calculates an average with multiple tweets", function () {
    var string1 = 'This is a great string with a positivie mood'
    var string2 = 'This is a horrible string with a really awful mood'
    var string3 = 'This string is absolutely euphoric'

    var sen1 = sentiment(string1)
    var sen2 = sentiment(string2)
    var sen3 = sentiment(string3)

    var averageSen = (sen1.score + sen2.score + sen3.score) / 3

    tweetSentimentAnalysis.addTweet(string1)
    tweetSentimentAnalysis.addTweet(string2)
    tweetSentimentAnalysis.addTweet(string3)

    expect(tweetSentimentAnalysis.getSentiment()).toEqual(averageSen)
  });

});
