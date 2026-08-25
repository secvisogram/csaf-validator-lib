import { Ajv } from 'ajv/dist/jtd.js'
import { walkPath } from '../../lib/walkPaths.js'
import { validateTimestamp } from '../dateHelper.js'

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
          first_known_exploitation_dates: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                date: { type: 'string' },
                exploitation_date: { type: 'string' },
              },
            },
          },
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
          metrics: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                content: {
                  additionalProperties: true,
                  optionalProperties: {
                    epss: {
                      additionalProperties: true,
                      optionalProperties: {
                        timestamp: { type: 'string' },
                      },
                    },
                    ssvc_v2: {
                      additionalProperties: true,
                      optionalProperties: {
                        timestamp: { type: 'string' },
                      },
                    },
                  },
                },
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
 * This implements the mandatory test 6.1.37 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export async function mandatoryTest_6_1_37(doc) {
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

    const result = validateTimestamp(date)
    if (!result.isValid) {
      ctx.errors.push({
        instancePath: path,
        message:
          result.error === 'INVALID_FORMAT'
            ? `invalid date format`
            : `invalid date`,
      })
      ctx.isValid = false
    }
  }

  for (const path of [
    '/document/tracking/current_release_date',
    '/document/tracking/generator/date',
    '/document/tracking/initial_release_date',
    '/document/tracking/revision_history[]/date',
    '/vulnerabilities[]/disclosure_date',
    '/vulnerabilities[]/discovery_date',
    '/vulnerabilities[]/first_known_exploitation_dates[]/date',
    '/vulnerabilities[]/first_known_exploitation_dates[]/exploitation_date',
    '/vulnerabilities[]/flags[]/date',
    '/vulnerabilities[]/involvements[]/date',
    '/vulnerabilities[]/metrics[]/content/epss/timestamp',
    '/vulnerabilities[]/metrics[]/content/ssvc_v2/timestamp',
    '/vulnerabilities[]/remediations[]/date',
    '/vulnerabilities[]/threats[]/date',
  ]) {
    await walkPath(doc, path, async (instancePath, value) => {
      if (typeof value === 'string') {
        validateDate(value, instancePath)
      }
    })
  }

  return ctx
}
