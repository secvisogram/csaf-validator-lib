import assert from 'node:assert'
import { mandatoryTest_6_1_9 } from '../../csaf_2_1/mandatoryTests.js'
import { calculateCvss4_0_Score } from '../../lib/shared/cvss4.js'

describe('mandatoryTest_6_1_9', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_9({ document: 'mydoc' }).isValid, true)
  })

  it('test calculate score', function () {
    const vectorString =
      'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H/E:P'
    const scores = calculateCvss4_0_Score(vectorString)

    assert.equal(scores[0].scoreJsonName, 'baseScore')
    assert.equal(scores[0].severityJsonName, 'baseSeverity')
    assert.equal(scores[0].score, 10)
    assert.equal(scores[1].scoreJsonName, 'threatScore')
    assert.equal(scores[1].severityJsonName, 'threatSeverity')
    assert.equal(scores[1].score, 9.3)
    assert.equal(scores[2].scoreJsonName, 'environmentalScore')
    assert.equal(scores[2].severityJsonName, 'environmentalSeverity')
    assert.equal(scores[2].score, 10)
  })
})
