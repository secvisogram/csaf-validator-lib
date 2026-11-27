import optionalTest_6_2_20 from '../lib/optionalTests/optionalTest_6_2_20.js'
import minimalCSAFBaseDoc from './shared/minimalCSAFBaseDoc.js'
import readExampleFiles from './shared/readExampleFiles.js'

const failingExamples = await readExampleFiles(
  new URL('optionalTest_6_2_20/failing', import.meta.url)
)

describe('Optional test 6.2.20', function () {
  describe('failing examples', function () {
    for (const [title, failingExample] of failingExamples) {
      it(title, function () {
        const result = optionalTest_6_2_20(failingExample)

        expect(result.warnings.length).to.be.greaterThan(0)
      })
    }
  })

  it('reports only additional properties, not duplicate items', function () {
    const result = optionalTest_6_2_20({
      ...minimalCSAFBaseDoc,
      x_additional: 1,
      vulnerabilities: [
        {
          product_status: {
            known_affected: [
              ...Array.from({ length: 19 }, (_, i) => `CSAFPID-${i}`),
              'CSAFPID-18',
            ],
          },
        },
      ],
    })

    expect(result).to.deep.equal({
      warnings: [
        { instancePath: '', message: 'must NOT have additional properties' },
      ],
    })
  })
})
