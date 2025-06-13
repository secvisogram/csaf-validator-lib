import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    document: {
      additionalProperties: true,
      optionalProperties: {
        distribution: {
          additionalProperties: true,
          optionalProperties: {
            tlp: {
              additionalProperties: true,
              optionalProperties: {
                label: { type: 'string' },
              },
            },
          },
        },
        tracking: {
          additionalProperties: true,
          optionalProperties: {
            status: { type: 'string' },
            revision_history: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
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
        optionalProperties: {
          disclosure_date: { type: 'string' },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * This implements the mandatory test 6.1.45 of the CSAF 2.1 standard.
 * For each vulnerability, it tests that the `disclosure_date` is earlier than or equal to 
 * the `date` of the newest item of the `revision_history` if the document is labeled 
 * `TLP:CLEAR` and the document status is `final` or `interim`.
 *
 * @param {any} doc
 */
export function mandatoryTest_6_1_45(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test ran and is
    finally returned by the function.
   */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc)) return ctx

  // Check if the document is labeled TLP:CLEAR and status is final or interim
  const tlpLabel = doc.document?.distribution?.tlp?.label
  const status = doc.document?.tracking?.status

  if (tlpLabel !== 'CLEAR' || (status !== 'final' && status !== 'interim')) {
    // Test is not applicable for this document
    return ctx
  }

  // Find the newest date in revision_history
  const revisionHistory = doc.document?.tracking?.revision_history || []
  if (revisionHistory.length === 0) {
    // No revision history to compare against
    return ctx
  }

  // Get all dates from revision history and find the newest one
  const revisionDates = revisionHistory
    .map((revision) => revision.date)
    .filter((date) => typeof date === 'string') // Ensure we only have strings
    .map((dateStr) => new Date(dateStr)) // Now dateStr is guaranteed to be a string

  if (revisionDates.length === 0) {
    // No valid dates in revision history
    return ctx
  }

  const newestRevisionDate = new Date(
    Math.max(...revisionDates.map((date) => date.getTime()))
  )

  // Check each vulnerability's disclosure_date
  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    const disclosureDate = vulnerability.disclosure_date
    if (typeof disclosureDate !== 'string') {
      // No disclosure date to check or not a string
      return
    }

    // At this point, disclosureDate is guaranteed to be a string
    const disclosureDateObj = new Date(disclosureDate)
    
    // Compare dates considering timezones (using getTime() which returns milliseconds since epoch)
    if (disclosureDateObj.getTime() > newestRevisionDate.getTime()) {
      ctx.errors.push({
        instancePath: `/vulnerabilities/${vulnerabilityIndex}/disclosure_date`,
        message: `disclosure_date (${disclosureDate}) is newer than the newest revision_history date (${newestRevisionDate.toISOString()}) which is not allowed for TLP:CLEAR documents with status '${status}'`,
      })
      ctx.isValid = false
    }
  })

  return ctx
}
