import { mandatoryTest_6_1_64_9 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_9.js'

describe('mandatoryTest_6_1_64_9', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_9({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('detects missing referenced action', function () {
    const result = mandatoryTest_6_1_64_9({
      document: {
        involvement: {
          actions: [{ action_id: 'ACN-2', referenced_action_ids: ['ACN-1'] }],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors[0].instancePath).to.equal(
      '/document/involvement/actions/0/referenced_action_ids/0'
    )
  })

  it('accepts defined references', function () {
    const result = mandatoryTest_6_1_64_9({
      document: {
        involvement: {
          actions: [
            { action_id: 'ACN-1' },
            { action_id: 'ACN-2', referenced_action_ids: ['ACN-1'] },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(true)
  })
})
