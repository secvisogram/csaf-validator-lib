import { recommendedTest_6_2_11 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_11', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_11({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })

  it('skips documents with empty tracking id', function () {
    expect(
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
      }).warnings.length
    ).to.equal(0)
  })

  it('skips reference without self references', function () {
    expect(
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
      }).warnings.length
    ).to.equal(0)
  })

  it('should warn when self reference has empty url', function () {
    expect(
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
      }).warnings.length
    ).to.equal(1)
  })

  it('warns with the correct index after filtering out non-self references', function () {
    const result = recommendedTest_6_2_11({
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
    })

    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/document/references/1/url'
    )
  })
})
