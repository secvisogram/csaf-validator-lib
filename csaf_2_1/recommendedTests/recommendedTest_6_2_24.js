import Ajv from 'ajv/dist/jtd.js'
import { cwecMap } from '../../lib/cwec.js'
import { LocalDate, ZoneId } from '@js-joda/core'
import {
  compareZonedDateTimes,
  localDateToTimeZonedDate,
} from '../../lib/shared/dateHelper.js'

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
            current_release_date: { type: 'string' },
          },
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          cwes: {
            elements: {
              additionalProperties: true,
              properties: {},
            },
          },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

const cweSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    id: { type: 'string' },
    version: { type: 'string' },
    name: { type: 'string' },
  },
})

const validateCWE = ajv.compile(cweSchema)

/**
 * This implements the recommended test 6.2.24 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export async function recommendedTest_6_2_24(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validateInput(doc)) {
    return context
  }

  const currentReleaseDate = doc.document.tracking.current_release_date
  const cwecArray = []
  for (const key of cwecMap.keys()) {
    const cwec = cwecMap.get(key)
    if (cwec) {
      const date = (await cwec()).default.date
      cwecArray.push([key, localDateToTimeZonedDate(date)])
    }
  }
  /** Make sure the array is sorted ascending by date hence this is crucial later */
  cwecArray.sort((a, b) => compareZonedDateTimes(b[1], a[1]))

  for (let i = 0; i < doc.vulnerabilities.length; ++i) {
    const vulnerability = doc.vulnerabilities[i]
    if (vulnerability.cwes) {
      for (let j = 0; j < vulnerability.cwes.length; ++j) {
        const cwe = vulnerability.cwes.at(j)
        if (validateCWE(cwe)) {
          const idx = cwecArray.findIndex((row) => row[0] === cwe.version)
          const zonedCweReleaseDate = cwecArray[idx][1]
          // Case 1: Check if the used cwe version was already published
          // at the current release date of the CSAF document
          if (
            compareZonedDateTimes(currentReleaseDate, zonedCweReleaseDate) < 0
          ) {
            context.warnings.push({
              instancePath: `/vulnerabilities/${i}/cwes/${j}/id`,
              message: `at release date ${currentReleaseDate} the used version ${cwe.version} was not published yet`,
            })
            // Case 2: Check if a newer cwe version than the used one had already been published
            // at the current release date of the CSAF document
          } else {
            const idx = cwecArray.findIndex((row) => row[0] === cwe.version)
            for (let i = idx - 1; i >= 0; i--) {
              const zonedCweReleaseDate = cwecArray[i][1]

              if (
                compareZonedDateTimes(currentReleaseDate, zonedCweReleaseDate) >
                0
              ) {
                context.warnings.push({
                  instancePath: `/vulnerabilities/${i}/cwes/${j}/id`,
                  message:
                    `the used cwe version ${cwe.version} ` +
                    `was not the newest one available at release date ${currentReleaseDate}`,
                })
              }
            }
          }
        }
      }
    }
  }
  return context
}
