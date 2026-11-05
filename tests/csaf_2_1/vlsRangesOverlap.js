import {
  initVls,
  isValidVls,
} from '../../csaf_2_1/shared/productVersionRangeHelper/vlsFormat.js'
import { vlsRangesOverlap } from '../../csaf_2_1/shared/productVersionRangeHelper/vlsRangesOverlap.js'

beforeAll(async function () {
  await initVls()
})

describe('vlsRangesOverlap', function () {
  /** @type {Array<[string, string, boolean]>} */
  const cases = [
    ['>2.1.0|<4.2.0', '>1.2.0|<2.4.0', true],
    ['>2.1.0|<4.2.0', '>4.2.0|<5.0.0', false],
    ['<2', '>2', false],
    ['<=2', '>=2', true],
    ['<2', '>=2', false],
    ['>1|<5', '3', true],
    ['>1|<5', '5', false],
    ['>=1|!=3|<=5', '3', false],
    ['<4.2', '<3', true],
    ['>10', '>2', true],
    ['<2', '<=1.9', true],
    ['1.0.0|1.1.0', '1.1.0', true],
    ['1.0.0|1.1.0', '1.2.0', false],
    ['>10.9a|!=10.9c|<=10.9k', '10.9c', false],
    ['>10.9a|!=10.9c|<=10.9k', '10.9b', true],
    ['<2024-4-pabc0019', '>2024-10-pefd0010', false],
    ['<2', '>V3', false],
    ['*', '>1', false],
    ['>1||', '>1', false],
    ['10.9', '>=10.9a', false],
    ['10.9', '<10.9a', true],
    ['1', '1.0', true],
    ['>1', '1.0', false],
    ['vers:semver/>1.0.0', '>1', false],
    ['>1', 'vers:semver/>1.0.0', false],
    ['<1.0', '>=1.0-rc1', false],
  ]

  for (const [a, b, expected] of cases) {
    it(`"${a}" and "${b}" ${
      expected ? 'overlap' : 'do not overlap'
    }`, function () {
      expect(vlsRangesOverlap(a, b)).to.equal(expected)
      expect(vlsRangesOverlap(b, a)).to.equal(expected)
    })
  }

  it('isValidVls detects well-formed vls', function () {
    for (const valid of ['>2.1.0|<4.2.0', '1.0|1.1', '<=2', '>10.9a|!=10.9c']) {
      expect(isValidVls(valid), valid).to.equal(true)
    }
    for (const invalid of ['*', '>1||', 'vers:npm', '', '>', '<=|>1']) {
      expect(isValidVls(invalid), invalid).to.equal(false)
    }
  })
})
