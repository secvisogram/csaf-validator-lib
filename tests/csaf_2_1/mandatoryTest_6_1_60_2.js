import { mandatoryTest_6_1_60_2 } from '../../csaf_2_1/mandatoryTests.js'

const documentation11SchemaUrl =
  'https://raw.githubusercontent.com/oasis-tcs/csaf/refs/heads/master/csaf_2.1/extension/data/valid/documentation-11/documentation-11-content_1.0.0.json'

describe('mandatoryTest_6_1_60_2', function () {
  it('reports a warning when the declared schema is unknown', async function () {
    const result = await mandatoryTest_6_1_60_2({
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
    expect(result.warnings[0].instancePath).to.equal('/x_extensions/0')
    expect(result.warnings[0].message).to.match(
      /https:\/\/example\.com\/csaf\/extension\/unknown_1\.0\.0\.json/
    )
    expect(result.warnings[0].message).to.match(/class: unknown/)
  })
  // --------------------------------------------------------------------------------------

  it('reports a warning (not an error) for an unsupported schema even when critical is true', async function () {
    const result = await mandatoryTest_6_1_60_2({
      x_extensions: [
        {
          $schema: 'https://example.com/csaf/extension/unknown_1.0.0.json',
          category: 'essential',
          content: { note: 'unknown critical schema' },
          critical: true,
        },
      ],
    })

    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
    expect(result.warnings.length).to.equal(1)
  })

  it('never performs network access to resolve a declared schema', async function () {
    const originalFetch = globalThis.fetch
    let fetchCalled = false
    globalThis.fetch = () => {
      fetchCalled = true
      throw new Error('network access is not allowed')
    }
    try {
      await mandatoryTest_6_1_60_2({
        x_extensions: [
          {
            $schema: 'https://example.com/csaf/extension/unknown_1.0.0.json',
            category: 'supplementary',
            content: { note: 'unknown schema' },
            critical: false,
          },
        ],
      })
    } finally {
      globalThis.fetch = originalFetch
    }
    expect(fetchCalled).to.equal(false)
  })

  it('validates against an allow-listed schema without any network access', async function () {
    const result = await mandatoryTest_6_1_60_2({
      x_extensions: [
        {
          $schema: documentation11SchemaUrl,
          category: 'supplementary',
          content: {
            documentation:
              'This extension is for documentation and test purposed only. It is valid. It is not allowed to be used in a production CSAF.',
          },
          critical: false,
        },
      ],
    })

    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
    expect(result.warnings.length).to.equal(0)
  })

  it('reports errors when an instance is invalid against an allow-listed schema', async function () {
    const result = await mandatoryTest_6_1_60_2({
      x_extensions: [
        {
          $schema: documentation11SchemaUrl,
          category: 'supplementary',
          content: { documentation: 'this does not match the const value' },
          critical: false,
        },
      ],
    })

    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.be.greaterThan(0)
    expect(result.warnings.length).to.equal(0)
  })
  //  // --------------------------------------------------------------------------------------
  it('skips extensions that have no $schema property', async function () {
    const result = await mandatoryTest_6_1_60_2({
      x_extensions: [{ category: 'supplementary', content: {} }],
    })

    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
    expect(result.warnings.length).to.equal(0)
  })
})
