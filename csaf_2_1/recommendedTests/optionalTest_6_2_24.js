import Ajv from 'ajv/dist/jtd.js'
import { cwecMap } from '../../lib/cwec.js'
import { LocalDate, ZoneId } from '@js-joda/core'
import { compareZonedDateTimes } from '../../lib/shared/dateHelper.js'

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
            current_release_date: { type: 'timestamp' },
          },
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        properties: {
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
 * This implements the optional test 6.2.24 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export async function optionalTest_6_2_24(doc) {
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
      cwecArray.push([key, date])
    }
  }

  for (let i = 0; i < doc.vulnerabilities.length; ++i) {
    const vulnerability = doc.vulnerabilities[i]
    for (let j = 0; j < vulnerability.cwes.length; ++j) {
      const cwe = vulnerability.cwes.at(j)
      if (validateCWE(cwe)) {
        const cwec = cwecMap.get(cwe.version)
        if (!cwec) {
          context.warnings.push({
            instancePath: `/vulnerabilities/${i}/cwes/${j}/version`,
            message: 'no such cwe version is recognized',
          })
          continue
        }
        const date = (await cwec()).default.date
        const localDate = LocalDate.parse(date)
        const localDateTime = localDate.atStartOfDay()
        const zonedDateTime = localDateTime.atZone(ZoneId.of('UTC'))
        const entry = (await cwec()).default.weaknesses.find(
          (w) => w.id === cwe.id
        )
        if (!entry) {
          context.warnings.push({
            instancePath: `/vulnerabilities/${i}/cwes/${j}/id`,
            message: `no weakness with this id is recognized in CWE ${cwe.version}`,
          })
          continue
        }
        if (compareZonedDateTimes(currentReleaseDate, zonedDateTime) < 0) {
          context.warnings.push({
            instancePath: `/vulnerabilities/${i}/cwes/${j}/id`,
            message: `at release date ${currentReleaseDate} the used version ${cwe.version}  was not published yet`,
          })
        } else {
          const idx = cwecArray.findIndex((row) => row[0] === cwe.version)
          for (let i = idx - 1; i >= 0; i--) {
            const localDate = LocalDate.parse(cwecArray[i][1])
            const localDateTime = localDate.atStartOfDay()
            const zonedDateTime = localDateTime.atZone(ZoneId.of('UTC'))
            if (compareZonedDateTimes(currentReleaseDate, zonedDateTime) > 0) {
              context.warnings.push({
                instancePath: `/vulnerabilities/${i}/cwes/${j}/id`,
                message: `the used version ${cwe.version} was not the newest one available at release date ${currentReleaseDate}`,
              })
            }
          }
        }
      }
    }
  }
  return context
}
