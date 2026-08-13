import { mandatoryTest_6_1_60_2 } from '../../csaf_2_1/mandatoryTests.js'

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
  })

  it('skips extensions that have no $schema property', async function () {
    const result = await mandatoryTest_6_1_60_2({
      x_extensions: [{ category: 'supplementary', content: {} }],
    })

    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
    expect(result.warnings.length).to.equal(0)
  })
})
