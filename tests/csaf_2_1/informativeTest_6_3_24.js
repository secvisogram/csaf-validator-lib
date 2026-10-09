vi.mock('#lib/informativeTests/shared/testURL.js', () => ({
  default: vi.fn(),
}))

import testURL from '#lib/informativeTests/shared/testURL.js'
import {
  informativeTest_6_3_24,
  readPublicKeyOrUndefined,
  stripPlusTag,
} from '../../csaf_2_1/informativeTests/informativeTest_6_3_24.js'

describe('informativeTest_6_3_24 (CSAF 2.1)', function () {
  it('only runs on relevant documents', async function () {
    const result = await informativeTest_6_3_24({
      document: {
        publisher: {
          contact: {
            email: 'test@csaf.example',
            public_openpgp_key_url: 1234,
          },
        },
      },
    })
    expect(result.infos.length).to.equal(0)
  })

  it('does not report when public_openpgp_key_url is undefined', async function () {
    const result = await informativeTest_6_3_24({
      document: {
        publisher: {
          contact: { email: 'test@csaf.example' },
        },
      },
    })
    expect(result.infos.length).to.equal(0)
  })

  it('does not report when email is undefined', async function () {
    const result = await informativeTest_6_3_24({
      document: {
        publisher: {
          contact: {
            public_openpgp_key_url: 'https://example.com/key.asc',
          },
        },
      },
    })
    expect(result.infos.length).to.equal(0)
  })

  describe('does not report when the key URL cannot be retrieved', function () {
    afterEach(function () {
      vi.mocked(testURL).mockRestore()
    })

    it('returns no infos on a network error while fetching the key', async function () {
      vi.mocked(testURL).mockImplementation(async (_url, onError) => {
        onError()
        return undefined
      })

      const result = await informativeTest_6_3_24({
        document: {
          publisher: {
            contact: {
              email: 'test@csaf.example',
              public_openpgp_key_url: 'https://example.com/key.asc',
            },
          },
        },
      })

      expect(result.infos.length).to.equal(0)
    })

    it('returns no infos when the retrieved key is not ASCII-armored', async function () {
      vi.mocked(testURL).mockResolvedValue(
        /** @type {any} */ ({ text: async () => 'not a key' })
      )

      const result = await informativeTest_6_3_24({
        document: {
          publisher: {
            contact: {
              email: 'test@csaf.example',
              public_openpgp_key_url: 'https://example.com/key.asc',
            },
          },
        },
      })

      expect(result.infos.length).to.equal(0)
    })
  })

  describe('stripPlusTag', function () {
    it('returns the same email when no plus tag is present', function () {
      const result = stripPlusTag('email')
      expect(result).to.equal('email')
    })

    it('returns the same email when no plus tag is present but an @ exists', function () {
      const result = stripPlusTag('foo@example.com')
      expect(result).to.equal('foo@example.com')
    })

    it('strips a plus tag from the local part', function () {
      const result = stripPlusTag('foo+bar@example.com')
      expect(result).to.equal('foo@example.com')
    })
  })

  describe('readPublicKeyOrUndefined', function () {
    it('returns undefined when the input is not ASCII-armored', async function () {
      const result = await readPublicKeyOrUndefined('not a key')
      expect(result).to.equal(undefined)
    })

    it('returns undefined for an empty string', async function () {
      const result = await readPublicKeyOrUndefined('')
      expect(result).to.equal(undefined)
    })
  })
})
