import { expect } from 'chai'
import validate from '../validate.js'

describe('validate', function () {
  it('throws if an unknown test function is passed and strict mode is requested', async function () {
    try {
      await validate(
        [
          function () {
            return {}
          },
        ],
        {}
      )
      expect.fail()
    } catch (/** @type {any} */ e) {
      expect(e.message).to.contain('Execution of test functions not defined in the library is prohibited.')
    }
  })
})
