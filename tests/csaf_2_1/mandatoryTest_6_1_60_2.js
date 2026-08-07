import assert from 'node:assert/strict'
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

    assert.equal(result.isValid, true)
    assert.equal(result.errors.length, 0)
    assert.equal(result.warnings.length, 1)
    assert.equal(result.warnings[0].instancePath, '/x_extensions/0')
    assert.match(
      result.warnings[0].message,
      /https:\/\/example\.com\/csaf\/extension\/unknown_1\.0\.0\.json/
    )
  })

  it('skips extensions that have no $schema property', async function () {
    const result = await mandatoryTest_6_1_60_2({
      x_extensions: [{ category: 'supplementary', content: {} }],
    })

    assert.equal(result.isValid, true)
    assert.equal(result.errors.length, 0)
    assert.equal(result.warnings.length, 0)
  })
})
