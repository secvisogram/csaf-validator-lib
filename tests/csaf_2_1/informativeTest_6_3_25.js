import { informativeTest_6_3_25 } from '../../csaf_2_1/informativeTests/informativeTest_6_3_25.js'

/**
 * @param {Array<Record<string, string>>} selections
 */
const docWith = (selections) => ({
  vulnerabilities: [
    {
      metrics: [
        {
          content: {
            ssvc_v2: { selections, timestamp: '2024-01-24T10:00:00.000Z' },
          },
        },
      ],
    },
  ],
})

describe('informativeTest_6_3_25', function () {
  it('only runs on relevant documents', async function () {
    expect(
      (await informativeTest_6_3_25({ vulnerabilities: 'x' })).infos
    ).toEqual([])
  })

  it('compares against the highest of more than two known versions', async function () {
    const { infos } = await informativeTest_6_3_25(
      docWith([
        { key: 'HI', namespace: 'ssvc', version: '2.0.0' },
        { key: 'HI', namespace: 'ssvc', version: '2.0.1' },
        { key: 'HI', namespace: 'ssvc', version: '2.0.2' },
      ])
    )
    expect(infos.map((info) => info.message)).toEqual([
      expect.stringContaining('(2.0.2)'),
      expect.stringContaining('(2.0.2)'),
    ])
  })

  it('checks namespaces with a fragment like nist#800-30', async function () {
    const { infos } = await informativeTest_6_3_25(
      docWith([{ key: 'P_5X', namespace: 'nist#800-30', version: '0.9.0' }])
    )
    expect(infos.map((info) => info.message)).toEqual([
      expect.stringContaining('(1.0.0)'),
    ])
  })

  describe('skips selections that cannot be checked', function () {
    /** @type {Array<[string, Record<string, string>]>} */
    const cases = [
      ['without namespace', { key: 'MI', version: '1.0.0' }],
      ['without version', { key: 'MI', namespace: 'ssvc' }],
      ['without key', { namespace: 'ssvc', version: '1.0.0' }],
      [
        'with special purpose namespace',
        { key: 'MI', namespace: 'x_test', version: '1.0.0' },
      ],
      [
        'with unregistered namespace',
        { key: 'MI', namespace: 'x_org.example#a', version: '1.0.0' },
      ],
    ]
    for (const [title, selection] of cases) {
      it(title, async function () {
        const { infos } = await informativeTest_6_3_25(docWith([selection]))
        expect(infos.length).toBe(0)
      })
    }
  })
})
