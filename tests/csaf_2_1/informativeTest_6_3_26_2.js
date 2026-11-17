import { informativeTest_6_3_26_2 } from '../../csaf_2_1/informativeTests/informativeTest_6_3_26_2.js'

describe('informativeTest_6_3_26_2', function () {
  it('skips documents without entity groups', function () {
    expect(informativeTest_6_3_26_2({ document: {} }).infos.length).to.equal(0)
  })

  it('reports unused entity group IDs', function () {
    const result = informativeTest_6_3_26_2({
      document: {
        involvement: {
          entity_groups: [{ entity_group_id: 'EGID-1' }],
        },
      },
    })
    expect(result.infos.length).to.equal(1)
    expect(result.infos[0].instancePath).to.equal(
      '/document/involvement/entity_groups/0/entity_group_id'
    )
  })
})
