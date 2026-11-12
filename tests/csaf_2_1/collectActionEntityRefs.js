import { collectActionEntityRefs } from '../../csaf_2_1/recommendedTests/shared/collectActionEntityRefs.js'

describe('collectActionEntityRefs', function () {
  it('returns an empty set for no actions', function () {
    expect(collectActionEntityRefs([]).size).to.equal(0)
  })

  it('collects acting and receiving refs of all actions', function () {
    const refs = collectActionEntityRefs([
      {
        acting_entity_refs: ['EID-0001'],
        receiving_entity_refs: ['EGID-0001'],
      },
      {
        acting_entity_refs: ['EID-0002'],
        receiving_entity_refs: ['EID-0001'],
      },
    ])
    expect([...refs].sort()).to.deep.equal([
      'EGID-0001',
      'EID-0001',
      'EID-0002',
    ])
  })

  it('handles actions without acting_entity_refs', function () {
    const refs = collectActionEntityRefs([
      { receiving_entity_refs: ['EID-0001'] },
    ])
    expect([...refs]).to.deep.equal(['EID-0001'])
  })

  it('handles actions without receiving_entity_refs', function () {
    const refs = collectActionEntityRefs([{ acting_entity_refs: ['EID-0001'] }])
    expect([...refs]).to.deep.equal(['EID-0001'])
  })

  it('handles actions without any refs', function () {
    expect(collectActionEntityRefs([{}]).size).to.equal(0)
  })
})
