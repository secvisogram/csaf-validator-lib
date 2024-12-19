import Ajv from 'ajv/dist/jtd.js'
import { Duration, ZonedDateTime } from '@js-joda/core'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    revision_history: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          date: { type: 'string' },
          number: { type: 'string' },
          summary: { type: 'string' },
        }
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
export default function optionalTest_6_2_22(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.revision_history.forEach((revision, i1) => {
    doc.revision_history.forEach((revision2, i2) => {
      if (revision.date && revision2.date) {
        try {
          const date1 = ZonedDateTime.parse(revision.date)
          const date2 = ZonedDateTime.parse(revision2.date)
          if (Duration.between(date1, date2) === Duration.ZERO) {
            ctx.warnings.push({
              instancePath: `/document/tracking/revision_history/${i1}/date`,
              message: `Revision ${i1 + 1} and ${i2 + 1} have the same timestamp`,
            })
          }
        } catch (_) { }
      }
    })
  })

  return ctx
}
