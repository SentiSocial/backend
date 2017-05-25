'use strict'
const api = require('../src/api')

describe('API module', () => {
  it('Should start the API', done => {
    api.start().then(() => {
      done()
    }).catch(console.error)
  })
})
