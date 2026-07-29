import assert from 'node:assert/strict'
import { recommendedTest_6_2_53 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_53.js'

describe('recommendedTest_6_2_53', function () {
  it('only runs on relevant documents', function () {
    assert.equal(recommendedTest_6_2_53({}).warnings.length, 0)
  })

  it('does not warn when ids are absent', function () {
    assert.equal(
      recommendedTest_6_2_53({ vulnerabilities: [{}] }).warnings.length,
      0
    )
  })

  it('does not warn when text is absent', function () {
    assert.equal(
      recommendedTest_6_2_53({
        vulnerabilities: [
          {
            ids: [{ system_name: 'https://example.com' }],
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('does not warn when system_name is not in the registry', function () {
    assert.equal(
      recommendedTest_6_2_53({
        vulnerabilities: [
          {
            ids: [
              {
                system_name: 'https://unknown-system.example.com',
                text: 'some-text',
              },
            ],
          },
        ],
      }).warnings.length,
      0
    )
  })
})
