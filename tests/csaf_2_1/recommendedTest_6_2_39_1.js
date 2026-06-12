import assert from 'node:assert'
import { recommendedTest_6_2_39_1 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_39_1', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_39_1({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })

  it('handles first_fixed as a valid fixed group', function () {
    const result = recommendedTest_6_2_39_1({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [
        {
          product_status: {
            known_affected: ['CSAFPID-0001'],
            first_fixed: ['CSAFPID-0001'],
          },
        },
      ],
    })
    assert.equal(result.warnings.length, 0)
  })

  it('does not warn when csaf_security_advisory has no vulnerabilities field (line 91)', function () {
    const result = recommendedTest_6_2_39_1({
      document: { category: 'csaf_security_advisory' },
    })
    assert.equal(result.warnings.length, 0)
  })

  it('does not warn when a vulnerability has no product_status field (line 94)', function () {
    const result = recommendedTest_6_2_39_1({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [{}],
    })
    assert.equal(result.warnings.length, 0)
  })

  it('does not warn when product_status has no affected groups (line 104)', function () {
    const result = recommendedTest_6_2_39_1({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [
        {
          product_status: {
            known_not_affected: ['CSAFPID-0001'],
            fixed: ['CSAFPID-0002'],
          },
        },
      ],
    })
    assert.equal(result.warnings.length, 0)
  })

  it('does not warn when fixed product exists but remediation targets a different product (line 147)', function () {
    // productRemediations for CSAFPID-0001 = [] because the remediation's product_ids
    // only contains CSAFPID-9999 → hasMustNotSkip=false, hasSkipIndicator=false
    // → reaches line 147: hasAnyFixed=true → returns without warning
    const result = recommendedTest_6_2_39_1({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [
        {
          product_status: {
            known_affected: ['CSAFPID-0001'],
            fixed: ['CSAFPID-0002'],
          },
          remediations: [
            {
              category: 'vendor_fix',
              details: 'Fix for a different product.',
              product_ids: ['CSAFPID-9999'],
            },
          ],
        },
      ],
    })
    assert.equal(result.warnings.length, 0)
  })

  it('warns generically when remediations exist only for other products (lines 150-153)', function () {
    // productRemediations for CSAFPID-0001 = [] because remediation targets CSAFPID-9999
    // → hasMustNotSkip=false, hasSkipIndicator=false, hasAnyFixed=false
    // → reaches lines 150-153: generic warning pushed
    const result = recommendedTest_6_2_39_1({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [
        {
          product_status: {
            known_affected: ['CSAFPID-0001'],
          },
          remediations: [
            {
              category: 'vendor_fix',
              details: 'Fix for a different product.',
              product_ids: ['CSAFPID-9999'],
            },
          ],
        },
      ],
    })
    assert.equal(result.warnings.length, 1)
    assert.match(result.warnings[0].message, /CSAFPID-0001/)
    assert.match(
      result.warnings[0].instancePath,
      /\/vulnerabilities\/0\/product_status/
    )
  })
})
