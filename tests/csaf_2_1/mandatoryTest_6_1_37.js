import assert from 'node:assert/strict'
import {
  isValidDate,
  mandatoryTest_6_1_37,
} from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_37.js'

describe('mandatoryTest_6_1_37', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_37({ document: 'mydoc' }).isValid, true)
  })

  describe('isValidDate', function () {
    const testCases = /** @type {Array<[string, boolean]>} */ ([
      ['2024-01-01T00:00:00Z', true],
      ['2024-01-01T00:00:00.000Z', true],
      ['2024-01-01T00:00:00.0Z', true],
      ['2024-01-01T00:00:00.11111111Z', true],
      ['2024-01-01T00:00:00+01:00', true],
      ['2024-01-01T00:00:00.111111+01:00', true],
      ['2024-01-01T:00:00+01:00', false],
      ['2024-01-01T25:00:00+01:00', false],
    ])

    testCases.forEach((testCase) => {
      it(`${testCase[0]} -> ${testCase[1]}`, () => {
        assert.equal(isValidDate(testCase[0]), testCase[1])
      })
    })
  })
})
