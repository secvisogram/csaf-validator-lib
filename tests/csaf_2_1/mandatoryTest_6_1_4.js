import { mandatoryTest_6_1_4 } from '../../csaf_2_1/mandatoryTests.js'

describe('mandatory test 6.1.4', function () {
  it('ignores non-string and empty-string group_ids values instead of reporting them as missing', async function () {
    const result = await mandatoryTest_6_1_4({
      vulnerabilities: [
        {
          notes: [
            {
              category: 'description',
              text: 'text',
              title: 'title',
              group_ids: ['', null, 42, {}],
            },
          ],
        },
      ],
    })
    expect(result.isValid).to.equal(true)
  })
})
