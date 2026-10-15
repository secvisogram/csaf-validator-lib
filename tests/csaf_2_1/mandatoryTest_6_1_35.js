import { mandatoryTest_6_1_35 } from '../../csaf_2_1/mandatoryTests.js'

describe('mandatoryTest_6_1_37', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_35({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('skips remediations without valid category', function () {
    expect(
      mandatoryTest_6_1_35({
        vulnerabilities: [{ remediations: [{}] }],
      }).isValid
    ).to.equal(true)
  })

  it('skips remediation group checks without declared group', function () {
    expect(
      mandatoryTest_6_1_35({
        vulnerabilities: [
          {
            remediations: [
              {
                category: 'some_category',
                group_ids: ['my_not_existing_group'],
              },
            ],
          },
        ],
      }).isValid
    ).to.equal(true)
  })
})
