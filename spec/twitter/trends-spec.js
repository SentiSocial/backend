const nock = require('nock')
const trends = require('../../src/twitter/trends')

describe('Twitter Trends Module', () => {
  beforeEach(() => {
    let mockTrendData =
      [
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
          {'name': '#trend1'},
          {'name': '#trend2'},
          {'name': '#trend3'}
          ]
        }
      ]

    nock('https://api.twitter.com/1.1')
    .get('/trends/place.json')
    .query(true)
    .reply(200, mockTrendData)
  })

  it('Should return the correct trends, in order', done => {
    trends.getTrends(trends => {
      expect(trends[0]).toEqual('#trend1')
      expect(trends[1]).toEqual('#trend2')
      expect(trends[2]).toEqual('#trend3')
      done()
    })
  })
})
