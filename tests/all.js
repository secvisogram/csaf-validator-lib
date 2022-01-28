const { expect } = require('chai')
const optionalTests = require('../lib/optionalTests.js')
const mandatoryTests = require('../lib/mandatoryTests.js')
const validate = require('../lib/validate.js')
const optionalTestTests = require('./Core/optionalTests.js')
const documentTests = require('./Core/documentTests.js')

describe('Core', () => {
  describe('mandatoryTests', () => {
    documentTests.forEach((documentTest, i) => {
      it(documentTest.title ?? `Mandatory Test #${i + 1}`, async () => {
        const result = validate(
          Object.values(mandatoryTests),
          documentTest.content
        )
        expect(result.isValid).to.equal(documentTest.valid)
        if (typeof documentTest.expectedNumberOfErrors === 'number') {
          expect(
            result.errors.length,
            'Document has the correct number of errors'
          ).to.equal(documentTest.expectedNumberOfErrors)
        }
        if (documentTest.valid) {
          expect(result.errors).to.have.lengthOf(0)
        } else {
          expect(result.errors).have.length.greaterThan(0)
        }
      })
    })
  })

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
