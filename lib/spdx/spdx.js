/** @typedef {import('./parser.js').ParseResult} ParseResult */

import exceptionsScancode from './exceptions-scancode.js'
import exceptionsSpdx from './exceptions-spdx.js'
import licensesScancode from './licenses-scancode.js'
import licensesSpdx from './licenses-spdx.js'

export { parse } from './parser.js'

export const spdxLicenses =
  /** @type {ReadonlyArray<{ id: string; deprecated: boolean }>} */ (
    licensesScancode
  ).concat(licensesSpdx)

export const spdxExceptions =
  /** @type {ReadonlyArray<{ id: string; deprecated: boolean }>} */ (
    exceptionsScancode
  ).concat(exceptionsSpdx)
