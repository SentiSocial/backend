const newsUtils = {
  /**
   * Transforms camel cased sentences to a spaced spaced sentence.
   * "thisIsAnExample" -> "this Is An Example"
   * "hiOCAreMyInitials" -> "hi OC Are My Initials"
   * "ABCNews" -> "ABC News"
   * "CNN" -> "CNN"
   * @param  {string} string
   * @return {string}
   * @author Omar Chehab
   */
  camelCaseToSpaced: function (string) {
    return string
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
  },

  /**
   * Replaces hyphens with spaces.
   * "this_is_an_example" -> "this is an example"
   * "what-about-dashes" -> "what about dashes"
   * @param  {sting} string
   * @return {sting}
   * @author Omar Chehab
   */
  unHyphenate: function (string) {
    return string
      .replace(/[_-]/g, ' ')
  },

  /**
   * Adds ? after all matches
   * @param  {string} substring  what to make optional from string
   * @param  {string} string
   * @return {string}
   * @author Omar Chehab
   */
  optionalize: function (substring, string, flags) {
    flags = flags || 'g'
    return string
      .replace(new RegExp(`(${substring})`, flags), '$1?')
  },

  /**
   * Generates a regular expression that leniently match a given string
   * @param  {string} string
   * @param  {string} flags  optional
   * @return {RegExp}
   * @author Omar Chehab
   */
  generateFuzzyPattern: function (string, flags) {
    flags = flags || 'i'
    string = newsUtils.camelCaseToSpaced(string)
    string = newsUtils.unHyphenate(string)
    string = newsUtils.optionalize('[#@ ]', string)
    return new RegExp(string, flags)
  }
}

module.exports = newsUtils
