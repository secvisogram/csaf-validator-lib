import assert from 'node:assert'
import { recommendedTest_6_2_11 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_11', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_11({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })

  it('skips documents with empty tracking id', function () {
    assert.equal(
      recommendedTest_6_2_11({
        document: {
          references: [
            {
              category: 'self',
              url: 'https://example.com/security/data/csaf/2024/oasis_csaf_tc-csaf_2.1-2024-6-2-11-01_1.json',
            },
          ],
          tracking: { id: '' },
        },
      }).warnings.length,
      0
    )
  })

  it('skips reference without self references', function () {
    assert.equal(
      recommendedTest_6_2_11({
        document: {
          references: [
            {
              category: 'external',
              url: 'https://example.com/security/data/csaf/2024/oasis_csaf_tc-csaf_2.1-2024-6-2-11-01_1.json',
            },
          ],
          tracking: { id: 'OASIS_CSAF_TC-CSAF_2.1-2024-6-2-11-01' },
        },
      }).warnings.length,
      0
    )
  })

  it('should warn when self reference has empty url', function () {
    assert.equal(
      recommendedTest_6_2_11({
        document: {
          references: [
            {
              category: 'self',
              url: '',
            },
          ],
          tracking: { id: 'OASIS_CSAF_TC-CSAF_2.1-2024-6-2-11-01' },
        },
      }).warnings.length,
      1
    )
  })

  it('skips empty reference', function () {
    assert.equal(
      recommendedTest_6_2_11({
        document: {
          references: [
            {},
            {
              category: 'self',
              url: 'https://example.com/security/data/csaf/2024/oasis_csaf_tc-csaf_2.1-2024-6-2-11-01_1.json',
            },
          ],
          tracking: { id: 'OASIS_CSAF_TC-CSAF_2.1-2024-6-2-11-01' },
        },
      }).warnings.length,
      1
    )
  })
})
