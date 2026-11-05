import { Ajv } from 'ajv/dist/jtd.js'
import { toTimeKey } from '../dateHelper.js'

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
            initial_release_date: { type: 'string' },
            status: { type: 'string' },
          },
          optionalProperties: {
            revision_history: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  date: { type: 'string' },
                  number: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * This implements the mandatory test 6.1.66 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_66(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc)) return ctx

  const { tracking } = doc.document
  if (tracking.status !== 'final' && tracking.status !== 'interim') return ctx

  const firstRevision = (tracking.revision_history ?? []).find(
    (item) => item.number === '1' || item.number === '1.0.0'
  )

  if (firstRevision?.date === undefined) {
    ctx.isValid = false
    ctx.errors.push({
      instancePath: '/document/tracking/initial_release_date',
      message:
        'the date of the revision history item with number 1 or 1.0.0 could not be determined',
    })
  } else if (
    toTimeKey(firstRevision.date) !== toTimeKey(tracking.initial_release_date)
  ) {
    ctx.isValid = false
    ctx.errors.push({
      instancePath: '/document/tracking/initial_release_date',
      message:
        'the initial release date does not match the date of the revision history item with number 1 or 1.0.0',
    })
  }

  return ctx
}
