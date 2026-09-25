import { hasHostname, isCanonicalUrl } from '../lib/shared/urlHelper.js'

describe('test url helper', function () {
  it('test isCanonicalUrl', function () {
    expect(
      isCanonicalUrl(
        {
          url: 'https://example.com/.well-known/csaf/clear/2024/oasis_csaf_tc-csaf_2_1-2024-6-2-47-12.json',
          category: 'self',
        },
        'OASIS_CSAF_TC-CSAF_2.1-2024-6-2-47-12'
      ),
      'Valid canonical URL'
    ).to.be.true

    expect(
      isCanonicalUrl(
        {
          url: 'https://example.com/.well-known/csaf/clear/2024/oasis_csaf_tc-csaf_2_1-2024-6-2-47-12.json',
          category: 'not_self',
        },
        'OASIS_CSAF_TC-CSAF_2.1-2024-6-2-47-12'
      ),
      'Invalid canonical URL - category not self'
    ).to.be.false
  })

  expect(
    isCanonicalUrl(
      {
        url: 'http://example.com/.well-known/csaf/clear/2024/oasis_csaf_tc-csaf_2_1-2024-6-2-47-12.json',
        category: 'self',
      },
      'OASIS_CSAF_TC-CSAF_2.1-2024-6-2-47-12'
    ),
    'Invalid canonical URL - url starts not with https://'
  ).to.be.false

  expect(
    isCanonicalUrl(
      {
        category: 'self',
      },
      'OASIS_CSAF_TC-CSAF_2.1-2024-6-2-47-12'
    ),
    'Invalid canonical URL - no URL '
  ).to.be.false

  expect(
    isCanonicalUrl(
      {
        url: 'https://example.com/.well-known/csaf/clear/2024/oasis_csaf_tc-csaf_2_1-2024-6-2-47-12_invalid.json',
        category: 'self',
      },
      'OASIS_CSAF_TC-CSAF_2.1-2024-6-2-47-12'
    ),
    'Valid canonical URL - URL ends not with valid filename'
  ).to.be.false

  it('isCanonicalUrl with requireHostname rejects empty hostname, but without requireHostname still uses simple endsWith check', function () {
    const reference = {
      url: 'https:///oasis_csaf_tc-csaf_2_1-2024-6-2-47-12.json',
      category: 'self',
    }
    const trackingId = 'OASIS_CSAF_TC-CSAF_2.1-2024-6-2-47-12'

    expect(
      isCanonicalUrl(reference, trackingId, true),
      'isCanonicalUrl with requireHostname should reject empty hostname'
    ).to.be.false

    expect(
      isCanonicalUrl(reference, trackingId),
      'isCanonicalUrl without requireHostname still uses simple endsWith check'
    ).to.be.true
  })

  it('returns true for a URL with a non-empty hostname', function () {
    expect(hasHostname('https://example.com/foo.json')).to.be.true
  })

  it('returns false for a URL with a missing host (extra slash)', function () {
    expect(hasHostname('https:///foo.json')).to.be.false
  })

  it('returns false for a URL with multiple extra slashes', function () {
    expect(hasHostname('https:////foo.json')).to.be.false
  })
})
