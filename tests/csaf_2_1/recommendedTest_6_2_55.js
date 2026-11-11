vi.mock('#lib/informativeTests/shared/testURL.js', () => ({
  default: vi.fn(),
}))

import testURL from '#lib/informativeTests/shared/testURL.js'
import * as openpgp from 'openpgp'
import { recommendedTest_6_2_55 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_55', function () {
  it('does not report a warning when public_openpgp_key_url is not a string', async function () {
    const result = await recommendedTest_6_2_55({
      document: {
        publisher: {
          contact: { public_openpgp_key_url: 123 },
        },
      },
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('does not report a warning when public_openpgp_key_url is undefined', async function () {
    const result = await recommendedTest_6_2_55({
      document: {
        publisher: {
          contact: {},
        },
      },
    })
    expect(result.warnings.length).to.equal(0)
  })

  describe('with a mocked key download', function () {
    const doc = {
      document: {
        publisher: {
          contact: { public_openpgp_key_url: 'https://csaf.example/key.asc' },
        },
      },
    }

    /**
     * @param {string | undefined} body
     * @param {string} [contentType]
     */
    function mockResponse(body, contentType) {
      const response =
        body === undefined
          ? undefined
          : new Response(new TextEncoder().encode(body), {
              headers: contentType ? { 'content-type': contentType } : {},
            })
      vi.mocked(testURL).mockImplementation(async (_url, onError) => {
        if (!response) onError()
        return response
      })
    }

    /**
     * @param {{
     *   type: 'ecc'
     *   userIDs: { name: string; email: string }[]
     *   subkeys?: { sign?: boolean; keyExpirationTime?: number }[]
     *   keyExpirationTime?: number
     *   date?: Date
     * }} options
     * @param {boolean} [withoutUserID] strips all User IDs from the key
     */
    async function generatePublicKey(options, withoutUserID = false) {
      const { publicKey } = await openpgp.generateKey({
        ...options,
        format: 'object',
      })
      if (withoutUserID) publicKey.users = []
      return publicKey.toPublic().armor()
    }

    const userIDs = [{ name: 'CSAF', email: 'test@csaf.example' }]

    it('does not report a warning when the URL is unreachable', async function () {
      mockResponse(undefined)
      const result = await recommendedTest_6_2_55(doc)
      expect(result.warnings.length).to.equal(0)
    })

    it('reports a missing content type', async function () {
      mockResponse(await generatePublicKey({ type: 'ecc', userIDs }))
      const result = await recommendedTest_6_2_55(doc)
      expect(result.warnings.map((w) => w.message)).to.deep.equal([
        'Content-Type does not match `application/pgp-keys`',
      ])
    })

    //
    //
    // it('accepts a key without User ID that has a usable encryption subkey', async function () {
    //   mockResponse(
    //     await generatePublicKey({ type: 'ecc', userIDs }, true),
    //     'application/pgp-keys'
    //   )
    //   const result = await recommendedTest_6_2_55(doc)
    //   expect(result.warnings.length).to.equal(0)
    // })
    //
    it('treats a subkey signature without key flags as not usable for encryption', async function () {
      mockResponse(
        await generatePublicKey({ type: 'ecc', userIDs }, true),
        'application/pgp-keys'
      )
      const verify = vi
        .spyOn(openpgp.Subkey.prototype, 'verify')
        .mockResolvedValue(/** @type {any} */ ({}))
      try {
        const result = await recommendedTest_6_2_55(doc)
        expect(result.warnings.map((w) => w.message)).to.deep.equal([
          'OpenPGP retrieved is not usable for encryption',
        ])
      } finally {
        verify.mockRestore()
      }
    })

    // it('reports a key without User ID whose encryption subkey is expired', async function () {
    //   mockResponse(
    //     await generatePublicKey(
    //       {
    //         type: 'ecc',
    //         userIDs,
    //         subkeys: [{ keyExpirationTime: 1 }],
    //         date: new Date(Date.now() - 60_000),
    //       },
    //       true
    //     ),
    //     'application/pgp-keys'
    //   )
    //   const result = await recommendedTest_6_2_55(doc)
    //   expect(result.warnings.map((w) => w.message)).to.deep.equal([
    //     'OpenPGP retrieved is not usable for encryption',
    //   ])
    // })
  })
})
