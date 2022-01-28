const { expect } = require('chai')
const optionalTests = require('../lib/optionalTests.js')
const validate = require('../lib/validate.js')
const optionalTestTests = require('./Core/optionalTests.js')

describe('Core', () => {
  describe('optionalTests', () => {
    optionalTestTests.forEach((documentTest, i) => {
      it(documentTest.title ?? `Optional Test #${i + 1}`, async () => {
        const result = validate(
          Object.values(optionalTests),
          documentTest.content
        )
        expect(result.isValid).to.be.true
        expect(result.errors).to.have.lengthOf(0)
        expect(
          result.warnings.length,
          'Document has the correct number of warnings'
        ).to.equal(documentTest.expectedNumberOfWarnings)
      })
    })
  })
})
