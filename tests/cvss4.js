import {
  calculateCvss4_0_Score,
  Cvss4JsonWrapper,
} from '../lib/shared/cvss4.js'
import { expect } from 'chai'
import assert from 'node:assert'

describe('CVSS4Attribute', () => {
  describe('CVSSMetrics', () => {
    it('4.0 empty metric', () => {
      const wrapper = new Cvss4JsonWrapper({})

      const data = wrapper.data
      expect(data.baseScore).to.equal(0)
      expect(data.baseSeverity).to.equal('None')
      expect(data.environmentalScore).to.equal(0)
      expect(data.environmentalSeverity).to.equal('None')
      expect(data.threatScore).to.equal(0)
      expect(data.threatSeverity).to.equal('None')
    })

    it('4.0 metrics can be calculated', () => {
      const wrapper = new Cvss4JsonWrapper({
        attackVector: 'PHYSICAL',
        attackComplexity: 'HIGH',
        privilegesRequired: 'HIGH',
        userInteraction: 'ACTIVE',
        scope: 'UNCHANGED',
        vulnConfidentialityImpact: 'HIGH',
      })

      const data = wrapper.data
      expect(data.baseScore).to.equal(4.1)
      expect(data.baseSeverity).to.equal('Medium')
      expect(data.environmentalScore).to.equal(4.1)
      expect(data.environmentalSeverity).to.equal('Medium')
      expect(data.threatScore).to.equal(4.1)
      expect(data.threatSeverity).to.equal('Medium')
    })

    it('4.0 set metrics by fields', () => {
      const wrapper = new Cvss4JsonWrapper({})
        .set('attackVector', 'PHYSICAL')
        .set('attackComplexity', 'HIGH')
        .set('privilegesRequired', 'HIGH')
        .set('userInteraction', 'ACTIVE')
        .set('scope', 'UNCHANGED')
        .set('vulnConfidentialityImpact', 'HIGH')

      const data = wrapper.data
      expect(data.baseScore).to.equal(4.1)
      expect(data.baseSeverity).to.equal('Medium')
      expect(data.environmentalScore).to.equal(4.1)
      expect(data.environmentalSeverity).to.equal('Medium')
      expect(data.threatScore).to.equal(4.1)
      expect(data.threatSeverity).to.equal('Medium')
    })

    it('Metrics can be updated from a 4.0 vector-string', () => {
      const vector = new Cvss4JsonWrapper({
        vulnAvailabilityImpact: 'NONE',
      })
      vector.updateFromVectorString(
        'CVSS:4.0/AV:P/AC:L/AT:N/PR:H/UI:A/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N/CR:L'
      )

      expect(vector.data).to.contain({
        version: '4.0',
        attackVector: 'PHYSICAL',
        attackComplexity: 'LOW',
        privilegesRequired: 'HIGH',
        userInteraction: 'ACTIVE',
        vulnAvailabilityImpact: 'NONE',
      })
    })

    it('Updating from an invalid vector-string clears all fields', () => {
      const vector = new Cvss4JsonWrapper({
        vulnAvailabilityImpact: 'NONE',
        attackVector: '',
        attackComplexity: '',
        privilegesRequired: '',
        userInteraction: '',
        scope: '',
        vulnConfidentialityImpact: '',
        vulnIntegrityImpact: '',
      })
      vector.updateFromVectorString('CVSS:4.0/AV:N/AC:L/PR:L/UI:R/S:U/C:H/I:x')

      expect(vector.data).to.contain({
        vectorString: 'CVSS:4.0/AV:N/AC:L/PR:L/UI:R/S:U/C:H/I:x',
        version: '4.0',
        attackVector: '',
        attackComplexity: '',
        privilegesRequired: '',
        userInteraction: '',
        scope: '',
        vulnConfidentialityImpact: '',
        vulnIntegrityImpact: '',
        vulnAvailabilityImpact: '',
      })
      expect(vector.data).to.not.contain({ exploitCodeMaturity: '' })
    })

    it('Updating from an invalid vector-string, fix vector string after set field', () => {
      const vector = new Cvss4JsonWrapper({
        vulnAvailabilityImpact: 'NONE',
        attackVector: '',
        attackComplexity: '',
        privilegesRequired: '',
        userInteraction: '',
        scope: '',
        vulnConfidentialityImpact: '',
        vulnIntegrityImpact: '',
      })

      vector.updateFromVectorString('1')

      expect(vector.data.vectorString).to.equal('1')
      vector.set('vulnConfidentialityImpact', 'HIGH')
      expect(vector.data.vectorString).to.equal(
        'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:N/VA:N/SC:N/SI:N/SA:N'
      )
    })

    it('Calculate score', () => {
      const score = calculateCvss4_0_Score(
        'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H/E:P'
      )

      assert.equal(score[0].scoreJsonName, 'baseScore')
      assert.equal(score[0].severityJsonName, 'baseSeverity')
      assert.equal(score[0].score, 10)
      assert.equal(score[1].scoreJsonName, 'threatScore')
      assert.equal(score[1].severityJsonName, 'threatSeverity')
      assert.equal(score[1].score, 9.3)
      assert.equal(score[2].scoreJsonName, 'environmentalScore')
      assert.equal(score[2].severityJsonName, 'environmentalSeverity')
      assert.equal(score[2].score, 10)
    })
  })
})
