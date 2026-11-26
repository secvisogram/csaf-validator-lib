import { Ajv } from 'ajv/dist/jtd.js'

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
        involvement: {
          additionalProperties: true,
          properties: {
            actions: {
              elements: {
                additionalProperties: true,
                properties: {
                  date: { type: 'string' },
                  status: { type: 'string' },
                },
              },
            },
          },
        },
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
  },
})

const validateInput = ajv.compile(inputSchema)

const STATUS_INDICATING_OCCURRED = new Set([
  'attempted',
  'completed',
  'discontinued',
])

/**
 * This implements the recommended test 6.2.56.5 of the CSAF 2.1 standard.
 *
 * For each action with the status `attempted`, `completed` or `discontinued`
 * it is tested that its `date` is not later than the newest item of the
 * `revision_history`. Dates are compared as instants, so timezones are taken
 * into account.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_56_5(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const revisionTimes = doc.document.tracking.revision_history
    .map((revision) => Date.parse(revision.date))
    .filter((time) => !Number.isNaN(time))
  if (revisionTimes.length === 0) return ctx
  const newestRevision = Math.max(...revisionTimes)

  doc.document.involvement.actions.forEach((action, index) => {
    if (!STATUS_INDICATING_OCCURRED.has(action.status)) return

    if (Date.parse(action.date) > newestRevision) {
      ctx.warnings.push({
        instancePath: `/document/involvement/actions/${index}/date`,
        message:
          'the date of the action is newer than the newest item of the revision history',
      })
    }
  })

  return ctx
}
