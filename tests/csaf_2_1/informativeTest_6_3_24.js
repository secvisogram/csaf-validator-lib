import { informativeTest_6_3_24 } from '../../csaf_2_1/informativeTests.js'

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
})
