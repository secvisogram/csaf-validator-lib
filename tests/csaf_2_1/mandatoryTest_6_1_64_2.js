import { mandatoryTest_6_1_64_2 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_2.js'

/**
 * @param {object[]} actions
 * @param {object} [rest]
 */
const docWith = (actions, rest = {}) => ({
  document: { involvement: { actions } },
  ...rest,
})

const base = {
  acting_entity_refs: ['EID-0001'],
  category: 'notification',
  date: '2024-01-10T09:00:00Z',
  receiving_entity_refs: ['EID-0002'],
}

describe('mandatoryTest_6_1_64_2', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_2({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('compares dates with an offset of +19:00 as points in time', function () {
    const sameInstant = mandatoryTest_6_1_64_2(
      docWith([
        { ...base, action_id: 'ACN-1', status: 'attempted' },
        {
          ...base,
          action_id: 'ACN-2',
          date: '2024-01-11T04:00:00+19:00',
          status: 'completed',
        },
      ])
    )
    expect(sameInstant.isValid).to.equal(false)

    const differentInstant = mandatoryTest_6_1_64_2(
      docWith([
        { ...base, action_id: 'ACN-1', status: 'attempted' },
        {
          ...base,
          action_id: 'ACN-2',
          date: '2024-01-10T10:00:00+19:00',
          status: 'completed',
        },
      ])
    )
    expect(differentInstant.isValid).to.equal(true)
  })

  it('expands entity groups', function () {
    const result = mandatoryTest_6_1_64_2({
      document: {
        involvement: {
          actions: [
            {
              ...base,
              action_id: 'ACN-1',
              acting_entity_refs: ['EGID-0001'],
              status: 'attempted',
            },
            {
              ...base,
              action_id: 'ACN-2',
              acting_entity_refs: ['EID-0001', 'EID-0003'],
              status: 'completed',
            },
          ],
          entity_groups: [
            {
              entity_group_id: 'EGID-0001',
              entity_ids: ['EID-0001', 'EID-0003'],
            },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors[0].instancePath).to.equal(
      '/document/involvement/actions/1'
    )
  })

  it('expands product groups', function () {
    const result = mandatoryTest_6_1_64_2({
      document: {
        involvement: {
          actions: [
            {
              ...base,
              action_id: 'ACN-1',
              group_ids: ['CSAFGID-0001'],
              status: 'attempted',
            },
            {
              ...base,
              action_id: 'ACN-2',
              product_ids: ['CSAFPID-0001', 'CSAFPID-0002'],
              status: 'completed',
            },
          ],
        },
      },
      product_tree: {
        product_groups: [
          {
            group_id: 'CSAFGID-0001',
            product_ids: ['CSAFPID-0001', 'CSAFPID-0002'],
          },
        ],
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors[0].instancePath).to.equal(
      '/document/involvement/actions/1'
    )
  })

  it('treats dl_vuln_ids mentioning all vulnerabilities as missing', function () {
    const result = mandatoryTest_6_1_64_2(
      docWith(
        [
          { ...base, action_id: 'ACN-1', status: 'attempted' },
          {
            ...base,
            action_id: 'ACN-2',
            dl_vuln_ids: ['VULN-2', 'VULN-1'],
            status: 'completed',
          },
        ],
        {
          vulnerabilities: [{ dl_vuln_id: 'VULN-1' }, { dl_vuln_id: 'VULN-2' }],
        }
      )
    )
    expect(result.isValid).to.equal(false)
  })

  it('compares explicit dl_vuln_ids subsets independent of order', function () {
    const result = mandatoryTest_6_1_64_2(
      docWith(
        [
          {
            ...base,
            action_id: 'ACN-1',
            dl_vuln_ids: ['VULN-1', 'VULN-2'],
            status: 'attempted',
          },
          {
            ...base,
            action_id: 'ACN-2',
            dl_vuln_ids: ['VULN-2', 'VULN-1'],
            status: 'completed',
          },
        ],
        {
          vulnerabilities: [
            { dl_vuln_id: 'VULN-1' },
            { dl_vuln_id: 'VULN-2' },
            { dl_vuln_id: 'VULN-3' },
          ],
        }
      )
    )
    expect(result.isValid).to.equal(false)
  })

  it('ignores vulnerabilities without dl_vuln_id', function () {
    const result = mandatoryTest_6_1_64_2(
      docWith(
        [
          { ...base, action_id: 'ACN-1', status: 'attempted' },
          {
            ...base,
            action_id: 'ACN-2',
            dl_vuln_ids: ['VULN-1'],
            status: 'completed',
          },
        ],
        { vulnerabilities: [{ dl_vuln_id: 'VULN-1' }, {}] }
      )
    )
    expect(result.isValid).to.equal(false)
  })

  it('falls back to the raw string for unparsable dates', function () {
    const invalid = mandatoryTest_6_1_64_2(
      docWith([
        { ...base, action_id: 'ACN-1', date: 'unknown', status: 'attempted' },
        { ...base, action_id: 'ACN-2', date: 'unknown', status: 'completed' },
      ])
    )
    expect(invalid.isValid).to.equal(false)

    const valid = mandatoryTest_6_1_64_2(
      docWith([
        { ...base, action_id: 'ACN-1', date: 'unknown', status: 'attempted' },
        { ...base, action_id: 'ACN-2', date: 'other', status: 'completed' },
      ])
    )
    expect(valid.isValid).to.equal(true)
  })

  it('accepts identical actions with the same status', function () {
    const result = mandatoryTest_6_1_64_2(
      docWith([
        { ...base, action_id: 'ACN-1', status: 'completed' },
        { ...base, action_id: 'ACN-2', status: 'completed' },
      ])
    )
    expect(result.isValid).to.equal(true)
    expect(result.errors).to.have.length(0)
  })
})
