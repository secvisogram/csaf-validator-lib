import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        tracking: {
          additionalProperties: true,
          properties: {
            revision_history: {
              elements: {
                additionalProperties: true,
                properties: {
                  date: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        properties: {
          disclosure_date: { type: 'string' },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * This implements the optional test 6.2.33 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function optionalTest_6_2_33(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
  }

  // current date in UTC
  const currentTimestampUtc = new Date()

  for (let i = 0; i < doc.vulnerabilities.length; ++i) {
    const disclosureDate = new Date(doc.vulnerabilities[i].disclosure_date)
    // check if the disclosure date is in the past
    if (currentTimestampUtc.getTime() - disclosureDate.getTime() > 0) {
      const revisionHistory = doc.document.tracking.revision_history
      // sort the revision history (ascending) so we don't need to loop through it
      // to find the date of its newest item
      revisionHistory.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      // compare the disclosure date with the date of the newest item in the revision history
      if (
        disclosureDate.getTime() -
          new Date(revisionHistory[revisionHistory.length - 1].date).getTime() >
        0
      ) {
        context.warnings.push({
          message:
            'The disclosure_date is in the past but newer than the date of the newest item in the revision_history.',
          instancePath: `/vulnerabilities/${i}/disclosure_date`,
        })
      }
    }
  }

  return context
}
