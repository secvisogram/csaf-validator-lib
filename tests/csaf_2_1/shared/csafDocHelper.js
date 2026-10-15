/**
 * @param {string} productId
 * @param {string} name
 */
export function productTreeWithFullProductName(productId, name) {
  return {
    full_product_names: [
      {
        product_id: productId,
        name: name,
      },
    ],
  }
}

/**
 * @param {string} filename
 * @param {Array<{algorithm?: string | null, value?: string}>} fileHashes
 */
export function productWithFileHashes(filename, fileHashes) {
  return {
    product_identification_helper: {
      hashes: [
        {
          filename: filename,
          file_hashes: fileHashes,
        },
      ],
    },
  }
}

/**
 * @param {number} baseSCore
 * @param {string} vectorString
 * @param {string[]} products
 */
export function cvssV31Content(baseSCore, vectorString, products) {
  return {
    content: {
      cvss_v3: {
        version: '3.1',
        vectorString: vectorString,
        baseScore: baseSCore,
        baseSeverity: severityFromScore(baseSCore),
      },
    },
    products: products,
  }
}

/**
 * @param {number} score
 * @return  {string}
 */
export function severityFromScore(score) {
  if (score >= 9.0) {
    return 'CRITICAL'
  }
  if (score >= 7.0) {
    return 'HIGH'
  }
  if (score >= 4.0) {
    return 'MEDIUM'
  }
  if (score >= 0.1) {
    return 'LOW'
  } else {
    return 'NONE'
  }
}
