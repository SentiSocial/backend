const nock = require('nock')
const rewire = require('rewire')
const trends = rewire('../../src/twitter/trends')

describe('Twitter Trends Module', () => {
  beforeAll(() => {
    // Mock trends data for different locations
    const worldwideTrendsMock = [
      {
        'as_of': '2012-08-24T23:25:43Z',
        'created_at': '2012-08-24T23:24:14Z',
        'locations': [
          {
            'name': 'Worldwide',
            'woeid': 1
          }
        ],
        'trends': [
          {'name': '#trend1', tweet_volume: 1},
          {'name': '#trend2', tweet_volume: 2},
          {'name': '#trend3', tweet_volume: 3}
        ]
      }
    ]

    const usaTrendsMock = [
      {
        'as_of': '2012-08-24T23:25:43Z',
        'created_at': '2012-08-24T23:24:14Z',
        'locations': [
          {
            'name': 'United States',
            'woeid': 23424977
          }
        ],
        'trends': [
        {'name': '#trend1', tweet_volume: 1},
        {'name': '#trend2', tweet_volume: 2},
        {'name': '#othertrend2', tweet_volume: 1}
        ]
      }
    ]

    const canadaTrendsMock = [
      {
        'as_of': '2012-08-24T23:25:43Z',
        'created_at': '2012-08-24T23:24:14Z',
        'locations': [
          {
            'name': 'Canada',
            'woeid': 23424775
          }
        ],
        'trends': [
        {'name': '#othertrend4', tweet_volume: 1},
        {'name': '#trend1', tweet_volume: 1},
        {'name': '#othertrend2', tweet_volume: 1}
        ]
      }
    ]

    const locationsAvailableMock = [
      {
        'country': 'United States',
        'countryCode': 'US',
        'woeid': 23424977
      },
      {
        'country': 'Canada',
        'countryCode': 'CA',
        'woeid': 23424775
      },
      {
        'country': 'Mexico',
        'countryCode': 'MX',
        'woeid': 23424900
      }
    ]

    function setMockTrendsPlace (woeid, mock) {
      nock('https://api.twitter.com/1.1')
      .get('/trends/place.json')
      .query({id: woeid})
      .reply(200, mock)
    }

    // Set up the mock trends/place endpoint
    setMockTrendsPlace(1, worldwideTrendsMock)
    setMockTrendsPlace(23424977, usaTrendsMock)
    setMockTrendsPlace(23424775, canadaTrendsMock)

    // Set up the mock trends/available endpoint
    nock('https://api.twitter.com/1.1')
    .get('/trends/available.json')
    .query(true)
    .reply(200, locationsAvailableMock)

    // Mock the config so that trends are only requested from the mocked endpoints
    const configMock = {
      locationsTracking: [23424977, 23424775]
    }
    trends.__set__('config', configMock)
  })

  it('should return the correct trends, in order', done => {
    trends.getTrends().then(trends => {
      expect(trends.length).toEqual(2)
      expect(trends[0]).toEqual({name: '#trend1', locations: ['US', 'CA'], tweet_volume: 1, rank: 1})
      expect(trends[1]).toEqual({name: '#trend2', locations: ['US'], tweet_volume: 2, rank: 2})
      done()
    })
  })
})
