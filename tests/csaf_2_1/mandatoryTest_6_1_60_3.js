import { mandatoryTest_6_1_60_3 } from '../../csaf_2_1/mandatoryTests.js'

const CUSTOM_SCHEMA = 'https://example.com/csaf/extension/custom_1.0.0.json'
const OTHER_SCHEMA = 'https://example.com/csaf/extension/other_1.0.0.json'

describe('mandatoryTest_6_1_60_3', function () {
  it('skips extensions that have no $schema property', async function () {
    const result = await mandatoryTest_6_1_60_3({
      x_extensions: [{ category: 'supplementary', content: {} }],
    })

    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
    expect(result.warnings.length).to.equal(0)
  })

  it('reports "not allowed" when metadata has no matching requirement key for this path', async function () {
    const resolveExtensionMetadata = async (
      /** @type {string} */ schemaUrl
    ) => {
      await Promise.resolve() // simulate e.g. a network round-trip
      return schemaUrl === CUSTOM_SCHEMA
        ? {
            // requirement only declared for a different path, so
            // resolveRequirement() finds no matching key and returns undefined
            requirement: { '$.document.x_extensions': { max_occurrence: 1 } },
          }
        : undefined
    }

    const item = { $schema: CUSTOM_SCHEMA, category: 'supplementary' }
    const result = await mandatoryTest_6_1_60_3(
      { x_extensions: [item] },
      resolveExtensionMetadata
    )

    expect(result.isValid).to.equal(false)
    expect(result.errors[0].message).to.match(/is not allowed/)
  })

  it('reports a warning when the declared extension metadata is unknown', async function () {
    const result = await mandatoryTest_6_1_60_3({
      x_extensions: [
        {
          $schema: 'https://example.com/csaf/extension/unknown_1.0.0.json',
          category: 'supplementary',
          content: { note: 'unknown schema' },
          critical: false,
        },
      ],
    })

    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal('/x_extensions')
    expect(result.warnings[0].message).to.match(
      /https:\/\/example\.com\/csaf\/extension\/unknown_1\.0\.0\.json/
    )
  })

  it('skips when x_extensions is not an array', async function () {
    const result = await mandatoryTest_6_1_60_3({
      x_extensions: { not: 'an array' },
    })

    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
    expect(result.warnings.length).to.equal(0)
  })

  it('evaluates incompatible_extensions using only the injected metadata', async function () {
    const resolveExtensionMetadata = (/** @type {string} */ schemaUrl) => {
      if (schemaUrl === CUSTOM_SCHEMA) {
        return {
          requirement: { '$.x_extensions': { max_occurrence: 1 } },
          incompatible_extensions: [OTHER_SCHEMA],
        }
      }
      if (schemaUrl === OTHER_SCHEMA) {
        return { requirement: { '$.x_extensions': { max_occurrence: 1 } } }
      }
      return undefined
    }

    const result = await mandatoryTest_6_1_60_3(
      {
        x_extensions: [
          { $schema: CUSTOM_SCHEMA, category: 'supplementary' },
          { $schema: OTHER_SCHEMA, category: 'supplementary' },
        ],
      },
      resolveExtensionMetadata
    )

    expect(result.isValid).to.equal(false)
    expect(
      result.errors.filter((e) => /is incompatible with/.test(e.message)).length
    ).to.equal(1)
  })

  it('reports an error when only the second extension declares the first as incompatible', async function () {
    const resolveExtensionMetadata = (/** @type {string} */ schemaUrl) => {
      if (schemaUrl === CUSTOM_SCHEMA) {
        return { requirement: { '$.x_extensions': { max_occurrence: 1 } } }
      }
      if (schemaUrl === OTHER_SCHEMA) {
        return {
          requirement: { '$.x_extensions': { max_occurrence: 1 } },
          incompatible_extensions: [CUSTOM_SCHEMA],
        }
      }
      return undefined
    }

    const result = await mandatoryTest_6_1_60_3(
      {
        x_extensions: [
          { $schema: CUSTOM_SCHEMA, category: 'supplementary' },
          { $schema: OTHER_SCHEMA, category: 'supplementary' },
        ],
      },
      resolveExtensionMetadata
    )

    expect(result.isValid).to.equal(false)
    expect(
      result.errors.filter((e) => /is incompatible with/.test(e.message)).length
    ).to.equal(1)
  })

  it('does not report an error when used extensions are not incompatible', async function () {
    const resolveExtensionMetadata = (/** @type {string} */ schemaUrl) => {
      if (schemaUrl === CUSTOM_SCHEMA) {
        return { requirement: { '$.x_extensions': { max_occurrence: 1 } } }
      }
      if (schemaUrl === OTHER_SCHEMA) {
        return { requirement: { '$.x_extensions': { max_occurrence: 1 } } }
      }
      return undefined
    }

    const result = await mandatoryTest_6_1_60_3(
      {
        x_extensions: [
          { $schema: CUSTOM_SCHEMA, category: 'supplementary' },
          { $schema: OTHER_SCHEMA, category: 'supplementary' },
        ],
      },
      resolveExtensionMetadata
    )

    expect(result.isValid).to.equal(true)
  })
})
