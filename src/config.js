'use strict'

var config = {
  // Address of MongoDB database to store trend ino in
  dbAddress: 'localhost',

  // Name of MongoDB database to store trend information
  dbName: 'sentisocial',

  // Maximum number of articles to store for each trend
  maxArticlesStorageCap: 10,

  // Maximum number of popular tweets to store for each trend
  tweetsStored: 20,

  // Number of tweets to send per request to the tweets endpoint
  tweetsPerRequest: 10,

  // Number of articles to send per request to the articles endpoint
  articlesPerRequest: 5,

  // Array of Yahoo! WOEIDs of countries to get trends for
  // Currently tries to cover most of the English speaking world
  woeid_array: [
    23424977, // United States
    23424775, // Canada
    23424975, // United Kingdom
    23424803, // Ireland
    23424748, // Australia
    23424916  // New Zealand
  ],

  // Number of tweets retreived per call to the Twitter search api
  popularTweetsPerSearch: 100,

  // Total number of popular tweets retreived for each trend from Twitter
  popularTweetsRetreivedTotal: 200,

  // Interval length in milliseconds, (1800000 is 30 mins)
  intervalLength: 1800000,

  // Port that the API listens on
  apiPort: 8080,

  // List of News API news org ids to retreive news info for
  // Orgs appearing higher in the array are more likely to have their articles stored
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
  ]
}

module.exports = config
