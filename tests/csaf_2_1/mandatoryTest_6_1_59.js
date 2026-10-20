import { mandatoryTest_6_1_59 } from '../../csaf_2_1/mandatoryTests.js'
import {
  initVls,
  isSingleVersionRange,
} from '../../csaf_2_1/shared/productVersionRangeHelper/vls.js'

describe('mandatoryTest_6_1_59', function () {
  it('only runs on relevant documents', async function () {
    expect(
      (await mandatoryTest_6_1_59({ vulnerabilities: 'mydoc' })).errors.length
    ).to.equal(0)
  })

  it('passes when product_tree has no branches', async function () {
    expect(
      (
        await mandatoryTest_6_1_59({
          product_tree: {
            full_product_names: [
              {
                name: 'Example Company Controller A 1.0',
                product_id: 'CSAFPID-908070601',
              },
            ],
          },
        })
      ).errors.length
    ).to.equal(0)
  })

  it('checks descendants of child branches that fail schema validation', async function () {
    const result = await mandatoryTest_6_1_59({
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Example',
            branches: [
              'not-an-object',
              {
                category: 'product_version_range',
                name: 42,
                branches: [
                  {
                    category: 'product_version_range',
                    name: 'vers:intdot/1.0.0',
                  },
                ],
              },
              { category: 'product_version_range', name: 'vers:intdot/4.2.0' },
            ],
          },
        ],
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.map((e) => e.instancePath)).to.deep.equal([
      '/product_tree/branches/0/branches/1/branches/0/name',
      '/product_tree/branches/0/branches/2/name',
    ])
  })
})

describe('isSingleVersionRange', function () {
  beforeAll(async function () {
    await initVls()
  })

  /** @type {Array<[string, boolean]>} */
  const cases = [
    ['vers:intdot/4.2.0', true],
    ['vers:semver/1.5.3', true],
    ['  vers:semver/1.5.3  ', true],
    ['VERS:semver/1.5.3', true],
    ['4.2.0', true],
    ['vers:intdot/>=4.0.0|<4.2.0', false],
    ['vers:intdot/4.2.0|4.3.0', false],
    ['vers:semver/<2.0.0', false],
    ['vers:semver/>=1.0.0', false],
    ['vers:semver/!=1.0.0', false],
    ['vers:semver/*', false],
    ['vers:semver/', false],
    ['', false],
    ['vers:semver/=1.5.3', false],
  ]

  for (const [input, expected] of cases) {
    it(`returns ${expected} for ${JSON.stringify(input)}`, function () {
      expect(isSingleVersionRange(input)).to.equal(expected)
    })
  }
})
