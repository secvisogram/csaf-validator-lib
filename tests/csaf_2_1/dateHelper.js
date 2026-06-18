import assert from 'node:assert/strict'
import { validateTimestamp } from '../../csaf_2_1/dateHelper.js'

describe('csaf_2_1/dateHelper', function () {
  describe('validateTimestamp', function () {
    /*
      A list of test cases to validate against the function. The `string` is the
      date to check and the `boolean` marks if the date is expected to be valid or
      invalid.
      
      - `true` means the date is expected to be VALID
      - `false` means the date is expected to be INVALID
    */
    const testCases =
      /** @type {Array<[string, import('../../csaf_2_1/dateHelper.js').ValidateTimestampResult]>} */ ([
        ['2024-01-01T00:00:00Z', { isValid: true }],
        ['2024-01-01T00:00:00.000Z', { isValid: true }],
        ['2024-01-01T00:00:00.0Z', { isValid: true }],
        ['2024-01-01T00:00:00.11111111Z', { isValid: true }],
        ['2024-01-01T00:00:00+01:00', { isValid: true }],
        ['2024-01-01T00:00:00.111111+01:00', { isValid: true }],
        [
          '2024-01-01T:00:00+01:00',
          { isValid: false, error: 'INVALID_FORMAT' },
        ],
        [
          '2024-01-01T25:00:00+01:00',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        ['2024-01-01T00:00:00.111111+01:00', { isValid: true }],
        ['2024-02-29T00:00:00.987564+01:00', { isValid: true }],
        ['2024-02-29T00:00:00.987564123123123123123+01:00', { isValid: true }],
        [
          '2015-06-30T10:29:60-13:30',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        [
          '2015-06-30T23:59:60+00:00',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        [
          '2015-07-01T06:59:60+07:00',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        [
          '2016-12-31T00:00:60-23:59',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        [
          '2016-12-31T23:59:60+00:00',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        [
          '2017-01-01T02:59:60+03:00',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        [
          '2017-01-01T02:59:60+04:00',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        [
          '2024-02-30T00:00:00+01:00',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        [
          '2024-04-31T00:00:00+01:00',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        [
          '2024-13-31T00:00:00+01:00',
          { isValid: false, error: 'INVALID_DATE' },
        ],
        [
          '2024-01-24 10:00:00.000Z',
          { isValid: false, error: 'INVALID_FORMAT' },
        ],
      ])

    testCases.forEach((testCase) => {
      it(`${testCase[0]} -> ${testCase[1]}`, () => {
        assert.deepEqual(validateTimestamp(testCase[0]), testCase[1])
      })
    })
  })
})
