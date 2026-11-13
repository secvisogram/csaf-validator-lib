import { informativeTest_6_3_26_4 } from '../../csaf_2_1/informativeTests/informativeTest_6_3_26_4.js'

describe('informativeTest_6_3_26_4', function () {
  it('skips documents without entities', function () {
    expect(informativeTest_6_3_26_4({ document: {} }).infos.length).to.equal(0)
  })

  it('reports duplicate names even if another entity has no name', function () {
    const result = informativeTest_6_3_26_4({
      document: {
        involvement: {
          entities: [{ name: 'A' }, { name: 'A' }, { entity_id: 'EID-1' }],
        },
      },
    })
    expect(result.infos.length).to.equal(1)
    expect(result.infos[0].instancePath).to.equal(
      '/document/involvement/entities/1/name'
    )
  })
})
