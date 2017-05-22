const keywordExtractor = require('keyword-extractor')
const KeywordBank = require('../../src/twitter/keyword-bank')

describe('KeywordBank', () => {
  it('Should extract keywords using keyword-extractor', () => {
    let keywordBank = new KeywordBank()
    let sentence = 'This is a sentence with some keywords for testing purposes'

    let keywords = keywordExtractor.extract(sentence)

    keywordBank.addText(sentence)

    keywordBank.getTopKeywords().forEach(keyword => {
      expect(keywords.indexOf(keyword.word)).not.toEqual(-1)
    })
  })

  it('Should count occurences', () => {
    let keywordBank = new KeywordBank()
    let word = 'keyword'

    keywordBank.addText(word)

    expect(keywordBank.getTopKeywords()[0]).toEqual({word: 'keyword', occurences: 1})
    keywordBank.addText(word)
    expect(keywordBank.getTopKeywords()[0]).toEqual({word: 'keyword', occurences: 2})
    keywordBank.addText(word)
    expect(keywordBank.getTopKeywords()[0]).toEqual({word: 'keyword', occurences: 3})
  })

  it('Should disregard links', () => {
    let keywordBank = new KeywordBank()

    keywordBank.addText('https://example.com')
    keywordBank.addText('http://example.com')
    keywordBank.addText('http://example.net')

    expect(keywordBank.getTopKeywords()).toEqual([])
  })

  it('Should disregard "rt" and "retweet" (case insensitive)', () => {
    let keywordBank = new KeywordBank()

    keywordBank.addText('rt retweet RT Retweet')

    expect(keywordBank.getTopKeywords()).toEqual([])
  })

  it('Should disregard words containing non alphanumeric characters (except for @ and #)', () => {
    let keywordBank = new KeywordBank()

    keywordBank.addText('$100')
    keywordBank.addText('\u2022') // Unicode bullet

    expect(keywordBank.getTopKeywords()).toEqual([])
  })
})
