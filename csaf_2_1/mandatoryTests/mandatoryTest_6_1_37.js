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
  properties: {
    document: {
      additionalProperties: true,
      optionalProperties: {
        tracking: {
          additionalProperties: true,
          optionalProperties: {
            current_release_date: { type: 'string' },
            generator: {
              additionalProperties: true,
              optionalProperties: {
                date: { type: 'string' },
              },
            },
            initial_release_date: { type: 'string' },
            revision_history: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  date: { type: 'string' },
                },
              },
            },
            discovery_date: { type: 'string' },
            flags: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  date: { type: 'string' },
                },
              },
            },
            release_date: { type: 'string' },
            involvements: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  date: { type: 'string' },
                },
              },
            },
            remediations: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  date: { type: 'string' },
                },
              },
            },
            threats: {
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
  },
})

const validate = ajv.compile(inputSchema)

// This regex validates a date against RFC 3339 section 5.6.
// See: https://datatracker.ietf.org/doc/html/rfc3339#section-5.6
const dateRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)(Z|[+-]\d{2}:\d{2})$/

/**
 * This implements the mandatory test 6.1.37 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function mandatoryTest_6_1_37(doc) {
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

  /**
   * This function validates the given date and generates and error on
   * `ctx` if it is not valid.
   *
   * @param {string | undefined} date The date to validate
   * @param {string} path The json path to the date
   */
  const validateDate = (date, path) => {
    if (date === undefined) return
    if (!dateRegex.exec(date)) {
      ctx.errors.push({
        instancePath: path,
        message: `invalid date`,
      })
      ctx.isValid = false
    }
  }

  validateDate(
    doc.document.tracking?.current_release_date,
    '/document/tracking/current_release_date'
  )
  validateDate(
    doc.document.tracking?.discovery_date,
    '/document/tracking/discovery_date'
  )
  validateDate(
    doc.document.tracking?.initial_release_date,
    '/document/tracking/initial_release_date'
  )
  validateDate(
    doc.document.tracking?.release_date,
    '/document/tracking/release_date'
  )
  validateDate(
    doc.document.tracking?.generator?.date,
    '/document/tracking/generator/date'
  )

  doc.document.tracking?.flags?.forEach((flag, index) => {
    validateDate(flag.date, `/document/tracking/flags/${index}/date`)
  })

  doc.document.tracking?.involvements?.forEach((involvement, index) => {
    validateDate(
      involvement.date,
      `/document/tracking/involvements/${index}/date`
    )
  })

  doc.document.tracking?.remediations?.forEach((remediation, index) => {
    validateDate(
      remediation.date,
      `/document/tracking/remediations/${index}/date`
    )
  })

  doc.document.tracking?.revision_history?.forEach((history, index) => {
    validateDate(
      history.date,
      `/document/tracking/revision_history/${index}/date`
    )
  })

  doc.document.tracking?.threats?.forEach((threat, index) => {
    validateDate(threat.date, `/document/tracking/threats/${index}/date`)
  })

  return ctx
}
