import { Ajv } from 'ajv/dist/jtd.js'
import { compareZonedDateTimes } from '../dateHelper.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
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
                optionalProperties: {
                  date: { type: 'string' },
                },
              },
            },
            status: { type: 'string' },
          },
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          discovery_date: { type: 'string' },
          disclosure_date: { type: 'string' },
        },
      },
    },
  },
})

/** @typedef {import('ajv/dist/jtd.js').JTDDataType<typeof inputSchema>} InputSchema */
/** @typedef {InputSchema['vulnerabilities'][number]} Vulnerability */
/** @typedef {{ date?: string }} RevisionHistoryItem */

const validateInput = ajv.compile(inputSchema)

/**
 * @param {Array<RevisionHistoryItem>} revisionHistory
 * @returns {RevisionHistoryItem | undefined} */
function getNewestRevisionHistoryEntry(revisionHistory) {
  // sort the revision history (descending) and save the newest entry
  return revisionHistory
    .filter((item) => item.date !== undefined)
    .sort((a, b) =>
      compareZonedDateTimes(
        /** @type {string} */ (b.date),
        /** @type {string} */ (a.date)
      )
    )[0]
}

/**
 * This implements the mandatory test 6.1.62 of the CSAF 2.1 standard.
 *
 * For each vulnerability, it is tested that the `discovery_date` is earlier
 * than or equal to the `date` of the newest item of the `revision_history` if
 * the document status is `final` or `interim`. Also, the `discovery_date` is
 * tested to be earlier than or equal to the `disclosure_date` of the same
 * vulnerability.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_62(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  /** @type {RevisionHistoryItem | undefined} */
  let newestRevisionHistoryItem
  const status = doc.document.tracking.status
  if (status === 'final' || status === 'interim') {
    const revisionHistory = doc.document.tracking.revision_history
    newestRevisionHistoryItem = getNewestRevisionHistoryEntry(revisionHistory)
  }

  /** @type {Array<Vulnerability>} */
  const vulnerabilities = doc.vulnerabilities
  vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    const discoveryDate = vulnerability.discovery_date
    if (!discoveryDate) {
      return
    }

    if (
      newestRevisionHistoryItem &&
      compareZonedDateTimes(
        discoveryDate,
        /** @type {string} */ (newestRevisionHistoryItem.date)
      ) > 0
    ) {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `/vulnerabilities/${vulnerabilityIndex}/discovery_date`,
        message:
          `The document is in status ${status} but the discovery_date is newer ` +
          `than the date of newest item in the revision_history`,
      })
    }

    const disclosureDate = vulnerability.disclosure_date
    if (
      disclosureDate &&
      compareZonedDateTimes(discoveryDate, disclosureDate) > 0
    ) {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `/vulnerabilities/${vulnerabilityIndex}/discovery_date`,
        message: 'the discovery_date is newer than the disclosure_date',
      })
    }
  })

  return ctx
}
