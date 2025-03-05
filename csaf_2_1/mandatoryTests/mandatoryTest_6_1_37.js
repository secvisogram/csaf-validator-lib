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
        tracking: {
          additionalProperties: true,
          optionalProperties: {
            generator: {
              additionalProperties: true,
              optionalProperties: {
                date: { type: 'string' },
              },
            },
            initial_release_date: { type: 'string' },
            current_release_date: { type: 'string' },
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
          discovery_date: { type: 'string' },
          flags: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                date: { type: 'string' },
              },
            },
          },
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
})

const validate = ajv.compile(inputSchema)

/**
 * This regex validates a date against RFC 3339 section 5.6.
 * See: https://datatracker.ietf.org/doc/html/rfc3339#section-5.6
 */
export const dateRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/

/**
 * Validates the given date against RFC 3339 section 5.6.
 *
 * @param {string} date The date to validate
 */
export const isValidDate = (date) => {
  /*
    Here we first check the string against the regex which catches format errors.
    But since this is not enough we convert it using the `Date` constructor.
    The `.getTime()` method of a JS date returns `NaN` in case of an
    invalid date (e.g. days, hours out of range etc.)
   */
  return (
    Boolean(dateRegex.exec(date)) && !Number.isNaN(new Date(date).getTime())
  )
}

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

    if (!isValidDate(date)) {
      ctx.errors.push({
        instancePath: path,
        message: `invalid date`,
      })
      ctx.isValid = false
    }
  }

  validateDate(
    doc.document?.tracking?.generator?.date,
    '/document/tracking/generator/date'
  )
  validateDate(
    doc.document?.tracking?.initial_release_date,
    '/document/tracking/initial_release_date'
  )
  validateDate(
    doc.document?.tracking?.current_release_date,
    '/document/tracking/current_release_date'
  )

  doc.document?.tracking?.revision_history?.forEach((history, index) => {
    validateDate(
      history.date,
      `/document/tracking/revision_history/${index}/date`
    )
  })

  doc.vulnerabilities?.forEach((vulnerabiltiy, vulnerabilityIndex) => {
    const prefix = `/vulnerabilities/${vulnerabilityIndex}`

    validateDate(vulnerabiltiy.disclosure_date, `${prefix}/disclosure_date`)
    validateDate(vulnerabiltiy.discovery_date, `/${prefix}/discovery_date`)

    vulnerabiltiy.flags?.forEach((flag, index) => {
      validateDate(flag.date, `${prefix}/flags/${index}/date`)
    })

    vulnerabiltiy.involvements?.forEach((involvement, index) => {
      validateDate(involvement.date, `${prefix}/involvements/${index}/date`)
    })

    vulnerabiltiy.remediations?.forEach((remediation, index) => {
      validateDate(remediation.date, `${prefix}/remediations/${index}/date`)
    })

    vulnerabiltiy.threats?.forEach((threat, index) => {
      validateDate(threat.date, `${prefix}/threats/${index}/date`)
    })
  })

  return ctx
}
