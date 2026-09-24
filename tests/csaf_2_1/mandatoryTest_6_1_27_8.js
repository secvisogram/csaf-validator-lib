import { mandatoryTest_6_1_27_8 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_8.js'

describe('mandatoryTest_6_1_27_8', function () {
  it('only runs on relevant documents (skips non-object document)', function () {
    expect(mandatoryTest_6_1_27_8({ document: 'mydoc' }).isValid).toBe(true)
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
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBe(1)
    expect(result.errors[0].instancePath).toBe(
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
    expect(result.isValid).toBe(true)
    expect(result.errors.length).toBe(0)
  })
})
