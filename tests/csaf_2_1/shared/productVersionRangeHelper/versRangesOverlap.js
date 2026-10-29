import isBrowserRuntime from '../../../shared/isBrowserRuntime.js'
import {
  initVers,
  isValidVers,
  versRangesOverlap,
} from '../../../../csaf_2_1/shared/productVersionRangeHelper/versRangesOverlap.js'

describe.skipIf(isBrowserRuntime)('versRangesOverlap', function () {
  beforeAll(initVers)
  it('validates VERS ranges', function () {
    expect(isValidVers('vers:semver/>1.0.0|<2.0.0')).to.equal(true)
    expect(isValidVers('vers:semver/*')).to.equal(true)
    expect(isValidVers('>1.0.0|<2.0.0')).to.equal(false)
    expect(isValidVers('vers:semver/>1.0.0||')).to.equal(false)
    expect(isValidVers('vers:semver/>%')).to.equal(false)
    expect(isValidVers('vers:semver/>')).to.equal(false)
    expect(isValidVers('vers:intdot/>1.0|<2.0')).to.equal(true)
  })

  it('detects overlapping ranges', function () {
    expect(
      versRangesOverlap(
        'vers:semver/>2.1.0|<4.2.0',
        'vers:semver/>1.2.0|<2.4.0'
      )
    ).to.equal(true)
    expect(versRangesOverlap('vers:semver/*', 'vers:semver/1.0.0')).to.equal(
      true
    )
    expect(
      versRangesOverlap('vers:semver/>=1.0.0|<2.0.0', 'vers:semver/1.5.0')
    ).to.equal(true)
    expect(
      versRangesOverlap(
        'vers:semver/>1.0.0|<2.0.0',
        'vers:semver/>1.0.0|<2.0.0'
      )
    ).to.equal(true)
    expect(
      versRangesOverlap('vers:deb/>1.0|<2.0', 'vers:deb/>1.5|<3.0')
    ).to.equal(true)
  })

  it('detects non-overlapping ranges', function () {
    expect(
      versRangesOverlap(
        'vers:semver/>2.4.0|<4.2.0',
        'vers:semver/>1.2.0|<2.1.0'
      )
    ).to.equal(false)
    expect(
      versRangesOverlap('vers:semver/<2.0.0', 'vers:semver/>=2.0.0')
    ).to.equal(false)
    expect(
      versRangesOverlap('vers:semver/!=1.0.0', 'vers:semver/1.0.0')
    ).to.equal(false)
  })

  it('does not report overlaps for different schemes or invalid input', function () {
    expect(versRangesOverlap('vers:semver/>1.0.0', 'vers:deb/>1.0')).to.equal(
      false
    )
    expect(versRangesOverlap('invalid', 'vers:semver/>1.0.0')).to.equal(false)
    expect(versRangesOverlap('vers:semver/>1.0.0', 'vers:semver/>a')).to.equal(
      false
    )
  })

  it('returns false if a version cannot be probed', function () {
    expect(
      versRangesOverlap(
        'vers:semver/>1.0.0',
        'vers:semver/>1.0.18446744073709551615'
      )
    ).to.equal(false)
  })
})
