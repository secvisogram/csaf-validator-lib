import { walkHashes } from '../shared/csafHelpers/walkHashes.js'

/**
 * @param {unknown} doc
 * @returns
 */
export function informativeTest_6_3_5(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  walkHashes(doc, ({ path, hash }) => {
    hash.file_hashes.forEach((fileHash, fileHashIndex) => {
      if (typeof fileHash.value === 'string' && fileHash.value.length < 64) {
        ctx.infos.push({
          instancePath: `${path}/${fileHashIndex}/value`,
          message: 'use of short hash',
        })
      }
    })
  })

  return ctx
}
