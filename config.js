'use strict'

const config = {
  // Address of MongoDB database to store trend ino in
  dbAddress: 'localhost',

  // Name of MongoDB database to store trend information
  dbName: 'sentisocial',

  // Port that the API listens on
  apiPort: 8080,

  // Maximum number of trends to track
  maxTrends: 10,

  // Maximum number of articles to store for each trend
  maxArticlesPerTrend: 10,

  // Maximum number of popular tweets to store for each trend
  maxTweetsPerTrend: 10,

  // Maximum number of keywords to store for each trend
  maxKeywordsPerTrend: 80,

  // Server interval length in seconds (Trends are updated every this many
  // seconds), (900 is 15 mins)
  intervalLength: 900,

  // Human readable descriptions of sentiment values to return via the API
  sentimentDescriptions: [
    {max: Infinity, min: 3, text: 'Extremely Positive'},
    {max: 3, min: 1.5, text: 'Very Positive'},
    {max: 1.5, min: 1, text: 'Positive'},
    {max: 1, min: 0.25, text: 'Slightly Positive'},
    {max: 0.25, min: -0.25, text: 'Neutral'},
    {max: -0.25, min: -1, text: 'Slightly Negative'},
    {max: -1, min: -1.5, text: 'Negative'},
    {max: -1.5, min: -3, text: 'Very Negative'},
    {max: -3, min: -Infinity, text: 'Extremely Negative'}
  ],

  // Array of Yahoo! WOEIDs of countries to get trends for
  // Currently tries to cover most of the English speaking world
  locationsTracking: [
    23424977, // United States
    23424775, // Canada
    23424975, // United Kingdom
    23424803, // Ireland
    23424748, // Australia
    23424916  // New Zealand
  ]
}

module.exports = config
