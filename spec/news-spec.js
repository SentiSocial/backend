'use strict'
const rewire = require('rewire')
const news = rewire('../src/news/news')

const camelCaseToSpaced = news.__get__('camelCaseToSpaced')
const unHyphenate = news.__get__('unHyphenate')
const optionalize = news.__get__('optionalize')
const generateFuzzyPattern = news.__get__('generateFuzzyPattern')

describe('News module', () => {
  it('converts camel case to spaced', () => {
    expect(camelCaseToSpaced('thisIsAnExample'))
      .toEqual('this Is An Example')

    expect(camelCaseToSpaced('hiOCAreMyInitials'))
      .toEqual('hi OC Are My Initials')

    expect(camelCaseToSpaced('ABCNews'))
      .toEqual('ABC News')

    expect(camelCaseToSpaced('CNN'))
      .toEqual('CNN')
  })

  it('removes hyphens', () => {
    expect(unHyphenate('this_is_an_example'))
      .toEqual('this is an example')

    expect(unHyphenate('what-about-dashes'))
      .toEqual('what about dashes')
  })

  it('creates optionlizes substrings by creating a regular expression', () => {
    expect(optionalize('#', '#hashtag'))
      .toEqual('#?hashtag')

    expect(optionalize('@', '@username'))
      .toEqual('@?username')

    expect(optionalize('[#@]', '#trending@username'))
      .toEqual('#?trending@?username')
  })

  it('generates a fuzzy pattern to match a string', () => {
    expect(generateFuzzyPattern('#IlCollegio'))
      .toEqual(/#?Il ?Collegio/i)

    expect(generateFuzzyPattern('#CasadosAPrimera'))
      .toEqual(/#?Casados ?A ?Primera/i)
  })
})
