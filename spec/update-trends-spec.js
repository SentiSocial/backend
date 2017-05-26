'use strict'
const rewire = require('rewire')
const updateTrends = rewire('../src/update-trends')
const mocks = require('./mocks')

describe('Update trends module', () => {
  // Returns a function that returns a promise that resolves with the specified data
  function getPromiseFunc (data) {
    return () => { return Promise.resolve(data) }
  }

  beforeAll(() => {
    const mockTrends = [
      {name: 'trend1', rank: 1},
      {name: 'trend2', rank: 2}
    ]

    // Set up all internal modules to return promises that resolve with mock data
    updateTrends.__set__('trends', {getTrends: getPromiseFunc(mockTrends)})
    updateTrends.__set__('news', {getNews: getPromiseFunc([mocks.getMockArticle()])})
    updateTrends.__set__('tweetSearch', {getTweetSample: getPromiseFunc([mocks.getMockTweet()])})
    updateTrends.__set__('dbUtils', {removeOldTrends: getPromiseFunc(), processTrend: getPromiseFunc()})

    const mockTweetStream = {
      getData: () => { return [] },
      closeStream: () => {},
      startTracking: () => {}
    }
    updateTrends.__set__('tweetStream', mockTweetStream)
  })

  it('Should get use the trends module to get trends', done => {
    const internalTrends = updateTrends.__get__('trends')
    spyOn(internalTrends, 'getTrends').and.returnValue(Promise.resolve([{name: 'trend1', rank: 1}]))

    updateTrends().then(() => {
      expect(internalTrends.getTrends).toHaveBeenCalled()
      done()
    })
  })

  it('Should remove old trends from the database', () => {
    const internalDbUtils = updateTrends.__get__('dbUtils')
    spyOn(internalDbUtils, 'removeOldTrends')

    updateTrends().then(() => {
      expect(internalDbUtils.removeOldTrends).toHaveBeenCalledWith(['trend1', 'trend2'])
    })
  })

  it('Should get news for each trend', () => {
    const internalNews = updateTrends.__get__('news')
    spyOn(internalNews, 'getNews').and.returnValue(Promise.resolve([mocks.getMockArticle()]))

    updateTrends().then(() => {
      expect(internalNews.getNews).toHaveBeenCalledWith('trend1')
      expect(internalNews.getNews).toHaveBeenCalledWith('trend2')
    })
  })

  it('Should get tweets for each trend', () => {
    const internalTweetSearch = updateTrends.__get__('tweetSearch')
    spyOn(internalTweetSearch, 'getTweetSample').and.returnValue(Promise.resolve([mocks.getMockTweet()]))

    updateTrends().then(() => {
      expect(internalTweetSearch.getTweetSample).toHaveBeenCalledWith('trend1')
      expect(internalTweetSearch.getTweetSample).toHaveBeenCalledWith('trend2')
    })
  })

  it('Should call processTrend for each trend', () => {
    const internalDbUtils = updateTrends.__get__('dbUtils')
    spyOn(internalDbUtils, 'processTrend').and.returnValue(Promise.resolve())

    updateTrends().then(() => {
      expect(internalDbUtils.processTrend).toHaveBeenCalledWith(jasmine.objectContaining({name: 'trend1'}),
        jasmine.any(Array),
        jasmine.any(Array),
        undefined)

      expect(internalDbUtils.processTrend).toHaveBeenCalledWith(jasmine.objectContaining({name: 'trend2'}),
        jasmine.any(Array),
        jasmine.any(Array),
        undefined)
    })
  })
})
