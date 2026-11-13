import { mandatoryTest_6_1_48 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_48.js'

const selectionWithoutNamespace6_1_48 = {
  vulnerabilities: [
    {
      cve: 'CVE-1900-0001',
      metrics: [
        {
          content: {
            ssvc_v2: {
              id: 'CVE-1900-0001',
              schemaVersion: '1-0-1',
              selections: [
                {
                  key: 'MI',
                  name: 'Mission Impact',
                  // namespace is intentionally omitted
                  values: [
                    { key: 'N', name: 'None' },
                    { key: 'D', name: 'Degraded' },
                  ],
                  version: '1.0.0',
                },
              ],
              timestamp: '2024-01-24T10:00:00.000Z',
            },
          },
          products: ['CSAFPID-9080700'],
        },
      ],
    },
  ],
}

const failingInputSchemaTestWithEmptyVulnerability6_1_48 = {
  vulnerabilities: [
    {}, // even this vulnerability is empty, the test should run
    {
      cve: 'CVE-1900-0001',
      metrics: [
        {
          content: {
            ssvc_v2: {
              id: 'CVE-1900-0001',
              schemaVersion: '1-0-1',
              selections: [
                {
                  key: 'MI',
                  name: 'Mission Impact',
                  namespace: 'ssvc',
                  values: [
                    { key: 'N', name: 'None' },
                    { key: 'D', name: 'Degraded' },
                  ],
                  version: '1.0.0',
                },
              ],
              timestamp: '2024-01-24T10:00:00.000Z',
            },
          },
          products: ['CSAFPID-9080700'],
        },
      ],
    },
  ],
}

/**
 * @param {Array<Record<string, unknown>>} selections
 */
function docWithSelections(selections) {
  return {
    vulnerabilities: [
      {
        metrics: [
          {
            content: {
              ssvc_v2: {
                id: 'CVE-1900-0001',
                schemaVersion: '1-0-1',
                selections,
                timestamp: '2024-01-24T10:00:00.000Z',
              },
            },
          },
        ],
      },
    ],
  }
}

/**
 * @param {string} namespace
 * @param {string[] | undefined} valueKeys
 * @param {string} [key]
 * @param {string} [version]
 */
function selection(namespace, valueKeys, key = 'MI', version = '1.0.0') {
  return {
    key,
    name: 'Mission Impact',
    namespace,
    version,
    ...(valueKeys && {
      values: valueKeys.map((valueKey) => ({ key: valueKey, name: valueKey })),
    }),
  }
}

describe('mandatoryTest_6_1_48', function () {
  it('skips vulnerabilities, metrics and ssvc_v2 without selections', function () {
    const result = mandatoryTest_6_1_48({
      vulnerabilities: [
        {},
        { metrics: [{}] },
        { metrics: [{ content: {} }] },
        { metrics: [{ content: { ssvc_v2: {} } }] },
      ],
    })
    expect(result.isValid).to.be.true
  })

  it('reports invalid namespaces', function () {
    const result = mandatoryTest_6_1_48(
      docWithSelections([selection('x_invalid#a', ['N'])])
    )
    expect(result.isValid).to.be.false
    expect(result.errors[0].message).to.include('invalid namespace')
  })

  it('skips unregistered namespaces', function () {
    const result = mandatoryTest_6_1_48(
      docWithSelections([selection('x_com.example#custom', ['N'], 'XX', '9')])
    )
    expect(result.isValid).to.be.true
  })

  it('skips special purpose and no-production-use namespaces', function () {
    const result = mandatoryTest_6_1_48(
      docWithSelections([
        selection('x_example#a', ['N'], 'XX', '9'),
        selection('x_test#a', ['N'], 'XX', '9'),
        selection('example', ['N'], 'XX', '9'),
        selection('test#a/de-DE', ['N'], 'XX', '9'),
      ])
    )
    expect(result.errors).to.deep.equal([])
    expect(result.isValid).to.be.true
  })

  it('reports a registered namespace without a matching decision point', function () {
    const result = mandatoryTest_6_1_48(
      docWithSelections([selection('ssvc', ['N'], 'XX', '9')])
    )
    expect(result.errors.length).to.eq(1)
    expect(result.errors[0].message).to.include('no decision point')
  })

  it('reports a registered namespace without key and version', function () {
    const result = mandatoryTest_6_1_48(
      docWithSelections([{ namespace: 'ssvc' }])
    )
    expect(result.errors.length).to.eq(1)
  })

  it('accepts a valid decision point with values in order', function () {
    const result = mandatoryTest_6_1_48(
      docWithSelections([selection('ssvc', ['N', 'MSC', 'MF'])])
    )
    expect(result.isValid).to.be.true
  })

  it('accepts a valid decision point without values', function () {
    const result = mandatoryTest_6_1_48(
      docWithSelections([selection('ssvc', undefined)])
    )
    expect(result.isValid).to.be.true
  })

  it('reports values that are not part of the decision point', function () {
    const result = mandatoryTest_6_1_48(
      docWithSelections([selection('ssvc', ['N', 'INVALID'])])
    )
    expect(result.errors.map((e) => e.message)).to.deep.equal([
      'this decision point contains invalid values',
    ])
  })

  it('reports values without a key', function () {
    const result = mandatoryTest_6_1_48(
      docWithSelections([
        { ...selection('ssvc', undefined), values: [{ name: 'None' }] },
      ])
    )
    expect(result.errors.map((e) => e.message)).to.deep.equal([
      'this decision point contains invalid values',
    ])
  })

  it('reports values that are not in order', function () {
    const result = mandatoryTest_6_1_48(
      docWithSelections([selection('ssvc', ['MF', 'N'])])
    )
    expect(result.errors.map((e) => e.message)).to.deep.equal([
      'this decision point values are not in order',
    ])
  })

  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_48({ document: 'mydoc' }).isValid).to.be.true
  })
  it('test input schema with empty json object in vulnerabilities', async function () {
    const result = mandatoryTest_6_1_48(
      failingInputSchemaTestWithEmptyVulnerability6_1_48
    )
    expect(result.errors.length).to.eq(1)
  })
  it('skips selection without namespace', function () {
    const result = mandatoryTest_6_1_48(selectionWithoutNamespace6_1_48)
    expect(result.errors.length).to.eq(0)
    expect(result.isValid).to.eq(true)
  })
})
