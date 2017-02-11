'use strict'
const newsUtils = require('../../src/utils/news-utils')

describe('News Utils', () => {
  it('converts camel case to spaced', () => {
    expect(newsUtils.camelCaseToSpaced('thisIsAnExample'))
      .toEqual('this Is An Example')

    expect(newsUtils.camelCaseToSpaced('hiOCAreMyInitials'))
      .toEqual('hi OC Are My Initials')

    expect(newsUtils.camelCaseToSpaced('ABCNews'))
      .toEqual('ABC News')

    expect(newsUtils.camelCaseToSpaced('CNN'))
      .toEqual('CNN')
  })

  it('removes hyphens', () => {
    expect(newsUtils.unHyphenate('this_is_an_example'))
      .toEqual('this is an example')

    expect(newsUtils.unHyphenate('what-about-dashes'))
      .toEqual('what about dashes')
  })

  it('creates optionlizes substrings by creating a regular expression', () => {
    expect(newsUtils.optionalize('#', '#hashtag'))
      .toEqual('#?hashtag')

    expect(newsUtils.optionalize('@', '@username'))
      .toEqual('@?username')

    expect(newsUtils.optionalize('[#@]', '#trending@username'))
      .toEqual('#?trending@?username')
  })

  it('generates a fuzzy pattern to match a string', () => {
    expect(newsUtils.generateFuzzyPattern('#IlCollegio'))
      .toEqual(/#?Il ?Collegio/i)

    expect(newsUtils.generateFuzzyPattern('#CasadosAPrimera'))
      .toEqual(/#?Casados ?A ?Primera/i)
  })
})
