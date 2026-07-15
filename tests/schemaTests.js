import { expect } from 'chai'
import { csaf_2_0 } from '../schemaTests.js'
import minimalCSAFBaseDoc from './shared/minimalCSAFBaseDoc.js'

describe('Schema test csaf_2_0', function () {
  // Scenario from https://github.com/secvisogram/secvisogram/issues/778:
  // Dates with seconds=60 that are not real leap seconds should be rejected
  // by the date-time format validation in the csaf_2_0 schema validator.
  it('should reject a document with a non-leap-second date with seconds=60', function () {
    const result = csaf_2_0({
      ...minimalCSAFBaseDoc,
      document: {
        ...minimalCSAFBaseDoc.document,
        tracking: {
          ...minimalCSAFBaseDoc.document.tracking,
          revision_history: [
            {
              date: '2026-12-31T23:59:60Z',
              number: '1',
              summary: 'Summary',
            },
          ],
        },
      },
    })
    expect(result.isValid).to.be.false
  })

  it('should accept a document with a real historical leap second date', function () {
    const result = csaf_2_0({
      ...minimalCSAFBaseDoc,
      document: {
        ...minimalCSAFBaseDoc.document,
        tracking: {
          ...minimalCSAFBaseDoc.document.tracking,
          revision_history: [
            {
              date: '2016-12-31T23:59:60Z',
              number: '1',
              summary: 'Summary',
            },
          ],
        },
      },
    })
    expect(result.isValid).to.be.true
  })
})
