import isBrowserRuntime from '../../../shared/isBrowserRuntime.js'
import {
  createVersOverlapChecker,
  initVers,
  isValidVers,
  lowest,
  successor,
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

  it('detects overlaps for large patch numbers', function () {
    expect(
      versRangesOverlap(
        'vers:semver/>1.0.0',
        'vers:semver/>1.0.18446744073709551615'
      )
    ).to.equal(true)
  })

  it('handles ranges with any number of components and schemes', function () {
    /** @type {[string, string, boolean][]} */
    const cases = [
      ['vers:intdot/>1|<3', 'vers:intdot/>2|<4', true],
      ['vers:intdot/>1.0|<3.0', 'vers:intdot/>2.0|<4.0', true],
      ['vers:intdot/>1.0.0|<3.0.0', 'vers:intdot/>2.0.0|<4.0.0', true],
      ['vers:intdot/>1.0.0.0|<1.0.0.5', 'vers:intdot/>1.0.0.2|<1.0.0.9', true],
      ['vers:intdot/>1.0|<2.0', 'vers:intdot/>3.0|<4.0', false],
      ['vers:intdot/<2.0', 'vers:intdot/>=2.0', false],
      ['vers:semver/>1.0.0|<3.0.0', 'vers:semver/>2.0.0|<4.0.0', true],
      ['vers:npm/>1.0.0|<3.0.0', 'vers:npm/>2.0.0|<4.0.0', true],
      ['vers:cargo/>1.0.0|<3.0.0', 'vers:cargo/>2.0.0|<4.0.0', true],
      ['vers:deb/>1.0|<3.0', 'vers:deb/>2.0|<4.0', true],
      ['vers:deb/>1:1.0-1|<1:3.0-1', 'vers:deb/>1:2.0-1|<1:4.0-1', true],
      ['vers:deb/>1.0-1|<3.0-1', 'vers:deb/>2.0-1|<4.0-1', true],
    ]
    for (const [a, b, expected] of cases) {
      expect(versRangesOverlap(a, b), `${a} ${b}`).to.equal(expected)
    }
  })

  it('detects deb ranges whose bounds differ only by a revision', function () {
    /** @type {[string, string][]} */
    const pairs = [
      ['1.0', '1.0-1'],
      ['1.0', '1.0+'],
      ['1.2.3', '1.2.3-0+deb1'],
      ['1.2.3', '1.2.3-0.1'],
      ['1.2.3', '1.2.3-1'],
      ['1.2.3', '1.2.3+dfsg-1'],
      ['1.2.3-1', '1.2.3-1+deb12u1'],
      ['1.2.3-1', '1.2.3-1.1'],
      ['1.2.3-1', '1.2.3-2'],
      ['1.2.3~rc1', '1.2.3~rc1-1'],
      ['1.2.3~rc1', '1.2.3~rc2'],
      ['1.2.3~rc1-1', '1.2.3~rc1-1+deb1'],
      ['1.2.3~rc1-1', '1.2.3~rc1-2'],
      ['1.2.3-1~bpo12+1', '1.2.3-1'],
      ['1.2.3+dfsg-1', '1.2.3+dfsg-1+deb12u1'],
      ['1.2.3+dfsg-1', '1.2.3+dfsg-2'],
      ['1.2.3-1+deb12u1', '1.2.3-1+deb12u2'],
      ['1.2.3-1+deb12u1', '1.2.3-1.1'],
      ['1.2.3-1ubuntu2.1', '1.2.3-1ubuntu2.2'],
      ['1:1.2.3-1', '1:1.2.3-2'],
      ['1.2.3-beta-1', '1.2.3-beta-2'],
      ['1.2.3a-1', '1.2.3a-1A'],
      ['1.2.3a-1', '1.2.3a-1+deb1'],
      ['1.2.3-00', '1.2.3-1'],
    ]
    for (const [lower, upper] of pairs) {
      const a = `vers:deb/>${lower}`
      const b = `vers:deb/<${upper}`
      expect(versRangesOverlap(a, b), `${a} ${b}`).to.equal(true)
      expect(versRangesOverlap(b, a), `${b} ${a}`).to.equal(true)
    }
    expect(versRangesOverlap('vers:deb/<1.0', 'vers:deb/>2.0')).to.equal(false)
    expect(versRangesOverlap('vers:deb/<1.0', 'vers:deb/>=1.0')).to.equal(false)
  })

  it('successor and lowest cover every scheme', function () {
    /** @type {Record<string, string>} */
    const examples = {
      alpm: '1.0-1',
      apk: '1.0-r1',
      composer: '1.0.0',
      cpan: '1.02',
      dart: '1.0.0',
      deb: '1.0',
      gem: '1.0.0',
      golang: 'v1.0.0',
      hackage: '1.0.0',
      maven: '1.0',
      nuget: '1.0.0',
      pypi: '1.0',
      rpm: '1.0-1',
      datetime: '2020-01-01T00:00:00Z',
      generic: '1.0',
      lexicographic: 'a',
      semver: '1.0.0',
      npm: '1.0.0',
      cargo: '1.0.0',
      intdot: '1.0',
    }
    for (const [scheme, version] of Object.entries(examples)) {
      const result = successor(scheme, version)
      expect(result.length, scheme).to.be.greaterThan(0)
      for (const candidate of result) {
        expect(candidate, scheme).to.not.equal(version)
      }
      expect(lowest(scheme), scheme).to.be.a('string')
    }
    for (const scheme of ['all', 'none']) {
      expect(successor(scheme, '1')).to.deep.equal([])
      expect(lowest(scheme)).to.equal(undefined)
    }
    expect(successor('unknown', '1')).to.deep.equal([])
    expect(lowest('unknown')).to.equal(undefined)
  })

  it('successor returns expected candidates', function () {
    expect(successor('alpm', '1.0-1')).to.deep.equal([
      '1.0-1.0',
      '1.0-1a',
      '1.0-1^',
    ])
    expect(lowest('alpm')).to.equal('0')
    expect(successor('golang', 'v1.2.3-pre')).to.deep.equal(['v1.2.3-pre.0'])
    expect(lowest('golang')).to.equal('v0.0.0-0')
    expect(successor('intdot', '1.0.0')).to.deep.equal(['1.0.1', '1.0.0.0.1'])
    expect(lowest('intdot')).to.equal('0')
    expect(successor('semver', '1.2.3')).to.deep.equal(['1.2.4-0', '1.3.0-0'])
    expect(successor('semver', '1.2.3-rc1+b')).to.deep.equal(['1.2.3-rc1.0'])
    expect(successor('intdot', '1.9')).to.deep.equal(['1.10', '1.9.0.1'])
    expect(successor('intdot', '1.18446744073709551615')[0]).to.equal(
      '1.18446744073709551616'
    )
    expect(successor('deb', '1.0')).to.deep.equal(['1.0-0A~', '1.0+'])
    expect(successor('deb', '1.0-1')).to.deep.equal(['1.0-1A~', '1.0-1+'])
    expect(successor('apk', '1.0-r1')).to.include('1.0-r2')
    expect(successor('apk', '1.0')).to.include('1.0-r1')
    expect(successor('golang', 'v1.2.3')).to.deep.equal([
      'v1.2.4-0',
      'v1.3.0-0',
    ])
    expect(successor('nuget', '1.2.3.4')[0]).to.equal('1.2.3.5')
    expect(successor('pypi', '1.0')).to.include('1.1.dev0')
    expect(successor('cpan', '1.02')).to.include('1.021')
    expect(successor('cpan', 'v1.2.3')[0]).to.equal('v1.2.4')
    expect(successor('gem', '1.0.0.rc1')).to.include('1.0.0.rc1.1')
    expect(successor('datetime', '2020-01-01T00:00:00.000Z')[0]).to.equal(
      '2020-01-01T00:00:00.001Z'
    )
    expect(successor('datetime', 'invalid')).to.deep.equal([])
    expect(successor('lexicographic', 'a')).to.deep.equal(['a\u0000'])
  })

  it('does not report overlaps for schemes vers-rs cannot parse yet', function () {
    expect(
      versRangesOverlap('vers:alpm/>1.0-1|<3.0-1', 'vers:alpm/>2.0-1|<4.0-1')
    ).to.equal(false)
    expect(
      versRangesOverlap(
        'vers:golang/>v1.0.0|<v3.0.0',
        'vers:golang/>v2.0.0|<v4.0.0'
      )
    ).to.equal(false)
    expect(
      versRangesOverlap('vers:intdot/>1.0.0|<3.0.0', 'vers:intdot/>2.0.0')
    ).to.equal(true)
  })

  it('createVersOverlapChecker is symmetric and consistent', function () {
    const overlaps = createVersOverlapChecker()
    /** @type {[string, string, boolean][]} */
    const cases = [
      ['vers:semver/>1.0.0|<3.0.0', 'vers:semver/>2.0.0|<4.0.0', true],
      ['vers:semver/<1.0.0', 'vers:semver/>2.0.0', false],
      ['vers:semver/*', 'vers:npm/1.0.0', false],
      ['vers:semver/>%', 'vers:semver/1.0.0', false],
    ]
    for (const [a, b, expected] of cases) {
      for (let i = 0; i < 2; i++) {
        expect(overlaps(a, b), `${a} ${b}`).to.equal(expected)
        expect(overlaps(b, a), `${b} ${a}`).to.equal(expected)
        expect(versRangesOverlap(a, b)).to.equal(expected)
      }
    }
  })
})
