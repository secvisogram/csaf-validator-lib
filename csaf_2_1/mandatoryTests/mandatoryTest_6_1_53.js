import Ajv from 'ajv/dist/jtd.js'
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
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          first_known_exploitation_dates: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                date: { type: 'string' },
                exploitation_date: { type: 'string' },
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
 * This implements the mandatory test 6.1.53 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function mandatoryTest_6_1_53(doc) {
  /*
      The `ctx` variable holds the state that is accumulated during the test ran and is
      finally returned by the function.
      */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc)) {
    return ctx
  }

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    const exploitationDates = vulnerability.first_known_exploitation_dates || []
    exploitationDates.forEach((item, Index) => {
      const date = item.date
      const exploitationDate = item.exploitation_date

      if (
        compareZonedDateTimes(
          /** @type {string} */ (date),
          /** @type {string} */ (exploitationDate)
        ) < 0
      ) {
        ctx.isValid = false
        ctx.errors.push({
          instancePath: `/vulnerabilities/${vulnerabilityIndex}/first_known_exploitation_dates/${Index}`,
          message:
            'the "exploitation_date" is newer than the "date" which states when that information was last updated',
        })
      }
    })
  })

  return ctx
}
