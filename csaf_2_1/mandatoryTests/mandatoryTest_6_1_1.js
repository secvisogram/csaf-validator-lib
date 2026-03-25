import * as docUtils from './shared/docUtils.js'

const { collectProductIds } = docUtils

/**
 * @typedef {Object} FullProductName
 * @property {string} name
 * @property {string} product_id
 */

/**
 * @typedef {Object} Branch
 * @property {Array<Branch>} branches
 * @property {FullProductName} product
 */

/**
 * @param {any} doc
 */
export function mandatoryTest_6_1_1(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  const productIds = collectProductIds({ document: doc })
  const productIdRefs = collectProductIdRefs({ document: doc })
  const missingProductDefinitions = findMissingDefinitions(
    productIds,
    productIdRefs
  )
  if (missingProductDefinitions.length > 0) {
    isValid = false
    missingProductDefinitions.forEach((missingProductDefinition) => {
      errors.push({
        message: 'definition of product id missing',
        instancePath: missingProductDefinition.instancePath,
      })
    })
  }
  return { isValid, errors }
}

/**
 * This method collects references to product ids and corresponding instancePaths in the given document and returns a result object.
 * @param {any} document
 * @returns {{id: string, instancePath: string}[]}
 */
function collectProductIdRefs({ document }) {
  const entries = /** @type {{id: string, instancePath: string}[]} */ ([])

  const productGroups = document.product_tree?.product_groups
  if (productGroups) {
    for (let i = 0; i < productGroups.length; ++i) {
      const productGroup = productGroups[i]
      const productIds = productGroup.product_ids
      if (productIds) {
        for (let j = 0; j < productIds.length; ++j) {
          const productId = productIds[j]
          if (productId) {
            entries.push({
              id: productId,
              instancePath: `/product_tree/product_groups/${i}/product_ids/${j}`,
            })
          }
        }
      }
    }
  }

  const productPaths = document.product_tree?.product_paths
  if (productPaths) {
    for (let i = 0; i < productPaths.length; ++i) {
      const productPath = productPaths[i]
      const beginningProductRef = productPath.beginning_product_reference
      if (beginningProductRef) {
        entries.push({
          id: beginningProductRef,
          instancePath: `/product_tree/product_paths/${i}/beginning_product_reference`,
        })
      }
      const subpaths = productPath.subpaths
      if (subpaths) {
        for (let j = 0; j < subpaths.length; ++j) {
          const nextProductRef = subpaths[j].next_product_reference
          if (nextProductRef) {
            entries.push({
              id: nextProductRef,
              instancePath: `/product_tree/product_paths/${i}/subpaths/${j}/next_product_reference`,
            })
          }
        }
      }
    }
  }

  const vulnerabilities = document.vulnerabilities
  if (vulnerabilities) {
    for (let i = 0; i < vulnerabilities.length; ++i) {
      const vulnerability = vulnerabilities[i]
      collectRefsInProductStatus(
        `/vulnerabilities/${i}/product_status`,
        vulnerability,
        entries
      )
      collectProductRefsInRemediations(
        `/vulnerabilities/${i}/remediations`,
        vulnerability,
        entries
      )
      collectRefsInMetrics(
        `/vulnerabilities/${i}/metrics`,
        vulnerability,
        entries
      )
      collectProductRefsInThreats(
        `/vulnerabilities/${i}/threats`,
        vulnerability,
        entries
      )
      collectProductRefsInFlags(
        `/vulnerabilities/${i}/flags`,
        vulnerability,
        entries
      )
      collectProductRefsInFirstKnownExploitationDates(
        `/vulnerabilities/${i}/first_known_exploitation_dates`,
        vulnerability,
        entries
      )
    }
  }

  return entries
}

/**
 * @param {string} instancePath
 * @param {{product_status: any}} vulnerability
 * @param {*} entries
 */
const collectRefsInProductStatus = (instancePath, vulnerability, entries) => {
  findRefsInProductStatus(
    vulnerability.product_status?.first_affected,
    `${instancePath}/first_affected`,
    entries
  )
  findRefsInProductStatus(
    vulnerability.product_status?.first_fixed,
    `${instancePath}/first_fixed`,
    entries
  )
  findRefsInProductStatus(
    vulnerability.product_status?.fixed,
    `${instancePath}/fixed`,
    entries
  )
  findRefsInProductStatus(
    vulnerability.product_status?.known_affected,
    `${instancePath}/known_affected`,
    entries
  )
  findRefsInProductStatus(
    vulnerability.product_status?.known_not_affected,
    `${instancePath}/known_not_affected`,
    entries
  )
  findRefsInProductStatus(
    vulnerability.product_status?.last_affected,
    `${instancePath}/last_affected`,
    entries
  )
  findRefsInProductStatus(
    vulnerability.product_status?.recommended,
    `${instancePath}/recommended`,
    entries
  )
  findRefsInProductStatus(
    vulnerability.product_status?.under_investigation,
    `${instancePath}/under_investigation`,
    entries
  )
  findRefsInProductStatus(
    vulnerability.product_status?.unknown,
    `${instancePath}/unknown`,
    entries
  )
}

/**
 * @param {string[]} refs
 * @param {string} instancePath
 * @param {{id: string, instancePath: string}[]} entries
 */
const findRefsInProductStatus = (refs, instancePath, entries) => {
  if (refs) {
    for (let i = 0; i < refs.length; ++i) {
      const ref = refs[i]
      if (ref) {
        entries.push({
          id: ref,
          instancePath: `${instancePath}/${i}`,
        })
      }
    }
  }
}

/**
 * @param {string} instancePath
 * @param {{threats: any}} vulnerability
 * @param {*} entries
 */
const collectProductRefsInThreats = (instancePath, vulnerability, entries) => {
  const threats = vulnerability.threats
  if (threats) {
    for (let i = 0; i < threats.length; ++i) {
      const threat = threats[i]
      const productIds = threat.product_ids
      if (productIds) {
        for (let j = 0; j < productIds.length; ++j) {
          const productId = productIds[j]
          if (productId) {
            entries.push({
              id: productId,
              instancePath: `${instancePath}/${i}/product_ids/${j}`,
            })
          }
        }
      }
    }
  }
}

/**
 * @param {string} instancePath
 * @param {{metrics: any}} vulnerability
 * @param {*} entries
 */
const collectRefsInMetrics = (instancePath, vulnerability, entries) => {
  const metrics = vulnerability.metrics
  if (metrics) {
    for (let i = 0; i < metrics.length; ++i) {
      const metric = metrics[i]
      const products = metric.products
      if (products) {
        for (let j = 0; j < products.length; ++j) {
          const productId = products[j]
          if (productId) {
            entries.push({
              id: productId,
              instancePath: `${instancePath}/${i}/products/${j}`,
            })
          }
        }
      }
    }
  }
}

/**
 * @param {string} instancePath
 * @param {{remediations: any}} vulnerability
 * @param {*} entries
 */
const collectProductRefsInRemediations = (
  instancePath,
  vulnerability,
  entries
) => {
  const remediations = vulnerability.remediations
  if (remediations) {
    for (let i = 0; i < remediations.length; ++i) {
      const remediation = remediations[i]
      const productIds = remediation.product_ids
      if (productIds) {
        for (let j = 0; j < productIds.length; ++j) {
          const productId = productIds[j]
          if (productId) {
            entries.push({
              id: productId,
              instancePath: `${instancePath}/${i}/product_ids/${j}`,
            })
          }
        }
      }
    }
  }
}

/**
 * @param {string} instancePath
 * @param {{flags: any}} vulnerability
 * @param {*} entries
 */
const collectProductRefsInFlags = (instancePath, vulnerability, entries) => {
  const flags = vulnerability.flags
  if (flags) {
    for (let i = 0; i < flags.length; ++i) {
      const flag = flags[i]
      const productIds = flag.product_ids
      if (productIds) {
        for (let j = 0; j < productIds.length; ++j) {
          const productId = productIds[j]
          if (productId) {
            entries.push({
              id: productId,
              instancePath: `${instancePath}/${i}/product_ids/${j}`,
            })
          }
        }
      }
    }
  }
}

/**
 * @param {string} instancePath
 * @param {{first_known_exploitation_dates: any}} vulnerability
 * @param {*} entries
 */
const collectProductRefsInFirstKnownExploitationDates = (
  instancePath,
  vulnerability,
  entries
) => {
  const firstKnownExploitationDates =
    vulnerability.first_known_exploitation_dates
  if (firstKnownExploitationDates) {
    for (let i = 0; i < firstKnownExploitationDates.length; ++i) {
      const entry = firstKnownExploitationDates[i]
      const productIds = entry.product_ids
      if (productIds) {
        for (let j = 0; j < productIds.length; ++j) {
          const productId = productIds[j]
          if (productId) {
            entries.push({
              id: productId,
              instancePath: `${instancePath}/${i}/product_ids/${j}`,
            })
          }
        }
      }
    }
  }
}

/**
 * @param {{id: string}[]} entries
 * @param {{id: string, instancePath: string}[]} refs
 */
const findMissingDefinitions = (entries, refs) => {
  return refs.filter(
    (ref) => entries.find((e) => e.id === ref.id) === undefined
  )
}
