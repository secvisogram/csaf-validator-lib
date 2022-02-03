const { expect } = require('chai')
const optionalTests = require('../lib/optionalTests.js')
const mandatoryTests = require('../lib/mandatoryTests.js')
const validate = require('../lib/validate.js')
const optionalTestTests = require('./Core/optionalTests.js')
const documentTests = require('./Core/documentTests.js')
const { csaf_2_0_strict, csaf_2_0 } = require('../lib/schemaTests.js')
const schemaTests = require('./Core/schemaTests.js')
const strip = require('../lib/strip.js')
const { default: Ajv } = require('ajv')

describe('Core', () => {
  describe('mandatoryTests', () => {
    documentTests.forEach((documentTest, i) => {
      it(documentTest.title ?? `Mandatory Test #${i + 1}`, async () => {
        const result = validate(
          [csaf_2_0, csaf_2_0_strict, ...Object.values(mandatoryTests)],
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
      it(documentTest.title ?? `Optional Test #${i + 1}`, () => {
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

  describe('schema', () => {
    describe('validate', function () {
      for (let i = 0; i < schemaTests.length; ++i) {
        const schemaTest = schemaTests[i]

        it(`Test #${i + 1}`, function () {
          const result = validate(
            [
              csaf_2_0,
              ...Object.values(mandatoryTests),
              ...Object.values(optionalTests),
            ],
            schemaTest.content
          )
          expect(result.isValid).to.equal(schemaTest.valid)
          if (schemaTest.valid) {
            expect(result.errors).to.have.lengthOf(0)
          } else {
            expect(result.errors).have.length.greaterThan(0)
          }
        })
      }
    })

    describe('strip', function () {
      it('When stripping a json document properties with errors are removed', () => {
        const schemaValidator = new Ajv({ allErrors: true }).compile({
          type: 'object',
          properties: { title: { type: 'string' } },
          required: ['title'],
        })

        const result = strip(
          [
            (doc) => {
              const isValid = schemaValidator(doc)
              return {
                isValid,
                errors:
                  /** @type {{ message?: string | undefined; instancePath: string; }[]} */ (
                    schemaValidator.errors ?? []
                  ),
              }
            },
          ],
          { title: 4 }
        )

        expect(result.document).to.deep.equal({})
        expect(result.strippedPaths).to.deep.equal([
          { instancePath: '/title', error: true, message: 'must be string' },
        ])
      })

      it('When stripping a json document empty properties are removed', () => {
        const schemaValidator = new Ajv({ allErrors: true }).compile({
          type: 'object',
          properties: { title: { type: 'string' } },
        })

        const result = strip(
          [
            (doc) => {
              const isValid = schemaValidator(doc)
              return {
                isValid,
                errors:
                  /** @type {{ message?: string | undefined; instancePath: string; }[]} */ (
                    schemaValidator.errors ?? []
                  ),
              }
            },
          ],
          { title: '' }
        )

        expect(result.document).to.deep.equal({})
        expect(result.strippedPaths).to.deep.equal([
          { instancePath: '/title', error: false, message: 'value was empty' },
        ])
      })

      for (let i = 0; i < schemaTests.length; ++i) {
        const schemaTest = schemaTests[i]
        if (schemaTest.strippedVersion === undefined) continue

        it(`Test #${i + 1}`, function () {
          const result = strip(
            [csaf_2_0_strict, ...Object.values(mandatoryTests)],
            schemaTest.content
          )

          expect(result.document).to.deep.equal(schemaTest.strippedVersion)
        })
      }
    })
  })
})
