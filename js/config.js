'use strict'

var config = {
  // Cap for articles to be displayed
  maxArticlesStorageCap: 20,

  // List of news sources sorted generally by popularity
  sources: [
    'The New York Times', 'Bloomberg', 'The Wall Street Journal',
    'The Washington Post', 'National Geographic', 'CNN', 'The Economist',
    'Time', 'Independent', 'Fortune', 'CNBC', 'Associated Press',
    'BBC News', 'Business Insider', 'Financial Times', 'ABC News',
    'Daily Mail', 'Buzzfeed', 'Reuters', 'The Guardian (UK)', 'The Telegraph',
    'USA Today', 'Ars Technica', 'BBC Sport', 'Business Insider (UK)',
    'Engadget', 'Entertainment Weekly', 'ESPN', 'ESPN Cric Info',
    'Football Italia', 'FourFourTwo', 'Fox Sports', 'Google News',
    'Hacker News', 'IGN', 'Mashable', 'Metro', 'Mirror', 'MTV News',
    'MTV News (UK)', 'New Scientist', 'Newsweek', 'New York Magazine',
    'NFL News', 'Polygon', 'Recode', 'Reddit /r/all', 'Sky News',
    'Sky Sports News', 'TalkSport', 'TechCrunch', 'TechRadar',
    'The Guardian (AU)', 'The Hindu', 'The Huffington Post', 'The Lad Bible',
    'The Next Web', 'The Sport Bible', 'The Times of India', 'The Verge'
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
  popularTweetsStored: 60
}

module.exports = config
