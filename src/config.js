'use strict'

const config = {
  // Address of MongoDB database to store trend ino in
  dbAddress: 'localhost',

  // Name of MongoDB database to store trend information
  dbName: 'sentisocial',

  // Port that the API listens on
  apiPort: 8080,

  // Maximum number of articles to store for each trend
  maxArticlesPerTrend: 10,

  // Maximum number of popular tweets to store for each trend
  maxTweetsPerTrend: 10,

  // Server interval length in seconds (Trends are updated every this many
  // seconds), (450 is 7.5 mins)
  intervalLength: 450,

  // Array of Yahoo! WOEIDs of countries to get trends for
  // Currently tries to cover most of the English speaking world
  locationsTracking: [
    23424977, // United States
    23424775, // Canada
    23424975, // United Kingdom
    23424803, // Ireland
    23424748, // Australia
    23424916  // New Zealand
  ],

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
