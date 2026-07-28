import assert from 'node:assert/strict'
import { mandatoryTest_6_1_27_8 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_8.js'

describe('mandatoryTest_6_1_27_8', function () {
  it('only runs on relevant documents (skips non-object document)', function () {
    assert.equal(mandatoryTest_6_1_27_8({ document: 'mydoc' }).isValid, true)
  })

  it('reports uncovered products when vulnerability has empty ids array', function () {
    const result = mandatoryTest_6_1_27_8({
      document: { category: 'csaf_vex' },
      vulnerabilities: [
        {
          ids: [],
          product_status: { known_affected: ['PROD_A'] },
        },
      ],
    })
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
    assert.equal(
      result.errors[0].instancePath,
      '/vulnerabilities/0/product_status/known_affected/0'
    )
  })

  it('returns valid when product_status is absent (nothing to check)', function () {
    const result = mandatoryTest_6_1_27_8({
      document: { category: 'csaf_vex' },
      vulnerabilities: [
        {
          ids: [
            {
              system_name: 'Tracking System',
              text: 'TRACK-001',
              product_ids: ['PROD_A'],
            },
          ],
        },
      ],
    })
    assert.equal(result.isValid, true)
    assert.equal(result.errors.length, 0)
  })
})
