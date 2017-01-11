'use strict'

var config = {
  // Name of MongoDB database to store trend information
  dbName: 'trendgator',

  // Name of MongoDB collection used to store trend information
  collectionName: 'trends',

  // Cap for articles to be displayed
  maxArticlesStorageCap: 20,

  // List of news sources sorted generally by popularity
  sources: [
    'the-new-york-times',
    'bloomberg',
    'the-wall-street-journal',
    'the-washington-post',
    'national-geographic',
    'cnn',
    'the-economist',
    'time',
    'independent',
    'fortune',
    'cnbc',
    'associated-press',
    'bbc-news',
    'business-insider',
    'financial-times',
    'abc-news-au',
    'daily-mail',
    'buzzfeed',
    'reuters',
    'the-guardian-uk',
    'the-telegraph',
    'usa-today',
    'ars-technica',
    'bbc-sport',
    'business-insider-uk',
    'engadget',
    'entertainment-weekly',
    'espn',
    'espn-cric-info',
    'football-italia',
    'four-four-two',
    'fox-sports',
    'google-news',
    'hacker-news',
    'ign',
    'mashable',
    'metro',
    'mirror',
    'mtv-news',
    'mtv-news-uk',
    'new-scientist',
    'newsweek',
    'new-york-magazine',
    'nfl-news',
    'polygon',
    'recode',
    'reddit-r-all',
    'sky-news',
    'sky-sports-news',
    'talksport',
    'techcrunch',
    'techradar',
    'the-guardian-au',
    'the-hindu',
    'the-huffington-post',
    'the-lad-bible',
    'the-next-web',
    'the-sport-bible',
    'the-times-of-india',
    'the-verge'
  ],

  // Number of tweets retreived per call to the search api
  popularTweetsPerSearch: 100,

  // Total number of popular tweets retreived for each trend
  popularTweetsRetreivedTotal: 200,

  // Interval length in milliseconds, (1800000 is 30 mins)
  intervalLength: 300000,

  // Weight that popular tweets are given relative to tweets that come in via the streaming API
  popularTweetWeight: 3,

  // Maximum number of popular tweets stroed in the database for each trend
  popularTweetsStored: 60,

  // Yahoo WOEID ID of location for grabbing tweets and trending topics
  woeid: 23424977
}

module.exports = config
