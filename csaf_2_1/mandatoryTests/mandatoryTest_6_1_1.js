import { Ajv } from 'ajv/dist/jtd.js'
import { collectProductIdsFromFullProductPath } from './shared/docProductUtils.js'

const ajv = new Ajv()

const productIdsSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_ids: { elements: { type: 'string' } },
  },
})

const productStatusSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    first_affected: { elements: { type: 'string' } },
    first_fixed: { elements: { type: 'string' } },
    fixed: { elements: { type: 'string' } },
    known_affected: { elements: { type: 'string' } },
    known_not_affected: { elements: { type: 'string' } },
    last_affected: { elements: { type: 'string' } },
    recommended: { elements: { type: 'string' } },
    under_investigation: { elements: { type: 'string' } },
    unknown: { elements: { type: 'string' } },
  },
})

const metricSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    products: { elements: { type: 'string' } },
  },
})

const vulnerabilitySchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    flags: { elements: productIdsSchema },
    first_known_exploitation_dates: { elements: productIdsSchema },
    involvements: { elements: productIdsSchema },
    metrics: { elements: metricSchema },
    notes: { elements: productIdsSchema },
    product_status: productStatusSchema,
    remediations: { elements: productIdsSchema },
    threats: { elements: productIdsSchema },
  },
})

const subpathSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    next_product_reference: { type: 'string' },
  },
})

const productPathSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    beginning_product_reference: { type: 'string' },
    subpaths: { elements: subpathSchema },
  },
})

const productGroupSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_ids: { elements: { type: 'string' } },
  },
})

const productTreeSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_groups: { elements: productGroupSchema },
    product_paths: { elements: productPathSchema },
  },
})

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    notes: { elements: productIdsSchema },
    product_tree: productTreeSchema,
    vulnerabilities: { elements: vulnerabilitySchema },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof vulnerabilitySchema>} Vulnerability
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof inputSchema>} InputSchema
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof metricSchema>} MetricSchema
 * @typedef {{id: string, instancePath: string}} ProductIdRef
 */

/**
 * This implements the mandatory test 6.1.1 of the CSAF 2.1 standard.
 *
 * @param {InputSchema} doc
 */
export function mandatoryTest_6_1_1(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test ran and is
    finally returned by the function.
   */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const productIds = collectProductIdsFromFullProductPath({ document: doc })
  const productIdRefs = collectProductIdRefs({ document: doc })
  const missingProductDefinitions = findMissingDefinitions(
    productIds,
    productIdRefs
  )
  if (missingProductDefinitions.length > 0) {
    ctx.isValid = false
    missingProductDefinitions.forEach((missingProductDefinition) => {
      ctx.errors.push({
        message: 'definition of product id missing',
        instancePath: missingProductDefinition.instancePath,
      })
    })
  }
  return ctx
}

/**
 * This method collects references to product ids and corresponding instancePaths in the given document and returns a result object.
 * @param {{ document: InputSchema }} document
 * @returns {ProductIdRef[]}
 */
function collectProductIdRefs({ document }) {
  const entries = /** @type {ProductIdRef[]} */ ([])
  document.notes?.forEach((documentNote, documentNoteIndex) => {
    const productIds = documentNote.product_ids
    productIds?.forEach((productId, productIdIndex) => {
      entries.push({
        id: productId,
        instancePath: `/notes/${documentNoteIndex}/product_ids/${productIdIndex}`,
      })
    })
  })

  const productGroups = document.product_tree?.product_groups
  if (productGroups) {
    productGroups?.forEach((productGroup, productGroupIndex) => {
      const productIds = productGroup.product_ids
      productIds?.forEach((productId, productIdIndex) => {
        entries.push({
          id: productId,
          instancePath: `/product_tree/product_groups/${productGroupIndex}/product_ids/${productIdIndex}`,
        })
      })
    })
  }

  const productPaths = document.product_tree?.product_paths
  if (productPaths) {
    productPaths?.forEach((productPath, productPathIndex) => {
      const beginningProductRef = productPath.beginning_product_reference
      if (beginningProductRef) {
        entries.push({
          id: beginningProductRef,
          instancePath: `/product_tree/product_paths/${productPathIndex}/beginning_product_reference`,
        })
      }
      const subpaths = productPath.subpaths
      if (subpaths) {
        subpaths?.forEach((subpath, subpathIndex) => {
          const nextProductRef = subpath.next_product_reference
          if (nextProductRef) {
            entries.push({
              id: nextProductRef,
              instancePath: `/product_tree/product_paths/${productPathIndex}/subpaths/${subpathIndex}/next_product_reference`,
            })
          }
        })
      }
    })
  }

  const vulnerabilities = document.vulnerabilities
  if (vulnerabilities) {
    vulnerabilities?.forEach((vulnerability, vulnerabilitiyIndex) => {
      collectRefsInProductStatus(
        `/vulnerabilities/${vulnerabilitiyIndex}/product_status`,
        vulnerability,
        entries
      )
      collectProductRefsInRemediations(
        `/vulnerabilities/${vulnerabilitiyIndex}/remediations`,
        vulnerability,
        entries
      )
      collectRefsInMetrics(
        `/vulnerabilities/${vulnerabilitiyIndex}/metrics`,
        vulnerability,
        entries
      )
      collectProductRefsInThreats(
        `/vulnerabilities/${vulnerabilitiyIndex}/threats`,
        vulnerability,
        entries
      )
      collectProductRefsInFlags(
        `/vulnerabilities/${vulnerabilitiyIndex}/flags`,
        vulnerability,
        entries
      )
      collectProductRefsInFirstKnownExploitationDates(
        `/vulnerabilities/${vulnerabilitiyIndex}/first_known_exploitation_dates`,
        vulnerability,
        entries
      )
      collectProductRefsInInvolvements(
        `/vulnerabilities/${vulnerabilitiyIndex}/involvements`,
        vulnerability,
        entries
      )
      collectProductRefsInNotes(
        `/vulnerabilities/${vulnerabilitiyIndex}/notes`,
        vulnerability,
        entries
      )
    })
  }

  return entries
}

/**
 * @param {string} instancePath
 * @param {Vulnerability} vulnerability
 * @param {ProductIdRef[]} entries
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
 * @param {string[] | undefined} refs
 * @param {string} instancePath
 * @param {ProductIdRef[]} entries
 */
const findRefsInProductStatus = (refs, instancePath, entries) => {
  refs?.forEach((ref, refIndex) => {
    entries.push({
      id: ref,
      instancePath: `${instancePath}/${refIndex}`,
    })
  })
}

/**
 * @param {string} instancePath
 * @param {Vulnerability} vulnerability
 * @param {ProductIdRef[]} entries
 */
const collectProductRefsInThreats = (instancePath, vulnerability, entries) => {
  vulnerability.threats?.forEach((threat, threatIndex) => {
    const productIds = threat.product_ids
    productIds?.forEach((productId, productIdIndex) => {
      entries.push({
        id: productId,
        instancePath: `${instancePath}/${threatIndex}/product_ids/${productIdIndex}`,
      })
    })
  })
}

/**
 * @param {string} instancePath
 * @param {Vulnerability} vulnerability
 * @param {ProductIdRef[]} entries
 */
const collectRefsInMetrics = (instancePath, vulnerability, entries) => {
  vulnerability.metrics?.forEach((metric, metricIndex) => {
    const products = metric.products
    products?.forEach((productId, productIdIndex) => {
      entries.push({
        id: productId,
        instancePath: `${instancePath}/${metricIndex}/products/${productIdIndex}`,
      })
    })
  })
}

/**
 * @param {string} instancePath
 * @param {Vulnerability} vulnerability
 * @param {ProductIdRef[]} entries
 */
const collectProductRefsInRemediations = (
  instancePath,
  vulnerability,
  entries
) => {
  vulnerability.remediations?.forEach((remediation, remediationIndex) => {
    const productIds = remediation.product_ids
    productIds?.forEach((productId, productIdIndex) => {
      entries.push({
        id: productId,
        instancePath: `${instancePath}/${remediationIndex}/product_ids/${productIdIndex}`,
      })
    })
  })
}

/**
 * @param {string} instancePath
 * @param {Vulnerability} vulnerability
 * @param {ProductIdRef[]} entries
 */
const collectProductRefsInFlags = (instancePath, vulnerability, entries) => {
  vulnerability.flags?.forEach((flag, flagIndex) => {
    const productIds = flag.product_ids
    productIds?.forEach((productId, productIdIndex) => {
      entries.push({
        id: productId,
        instancePath: `${instancePath}/${flagIndex}/product_ids/${productIdIndex}`,
      })
    })
  })
}

/**
 * @param {string} instancePath
 * @param {Vulnerability} vulnerability
 * @param {ProductIdRef[]} entries
 */
const collectProductRefsInFirstKnownExploitationDates = (
  instancePath,
  vulnerability,
  entries
) => {
  vulnerability.first_known_exploitation_dates?.forEach(
    (firstKnownExploitationDate, firstKnownExploitationDateIndex) => {
      const productIds = firstKnownExploitationDate.product_ids
      productIds?.forEach((productId, productIdIndex) => {
        entries.push({
          id: productId,
          instancePath: `${instancePath}/${firstKnownExploitationDateIndex}/product_ids/${productIdIndex}`,
        })
      })
    }
  )
}

/**
 * @param {string} instancePath
 * @param {Vulnerability} vulnerability
 * @param {ProductIdRef[]} entries
 */
const collectProductRefsInInvolvements = (
  instancePath,
  vulnerability,
  entries
) => {
  vulnerability.involvements?.forEach((involvement, involvementIndex) => {
    const productIds = involvement.product_ids
    productIds?.forEach((productId, productIdIndex) => {
      entries.push({
        id: productId,
        instancePath: `${instancePath}/${involvementIndex}/product_ids/${productIdIndex}`,
      })
    })
  })
}

/**
 * @param {string} instancePath
 * @param {Vulnerability} vulnerability
 * @param {ProductIdRef[]} entries
 */
const collectProductRefsInNotes = (instancePath, vulnerability, entries) => {
  vulnerability.notes?.forEach((note, noteIndex) => {
    const productIds = note.product_ids
    productIds?.forEach((productId, productIdIndex) => {
      entries.push({
        id: productId,
        instancePath: `${instancePath}/${noteIndex}/product_ids/${productIdIndex}`,
      })
    })
  })
}

/**
 * @param {{id: string}[]} entries
 * @param {{id: string, instancePath: string}[]} refs
 */
const findMissingDefinitions = (entries, refs) => {
  return refs.filter((ref) => !entries.some((e) => e.id === ref.id))
}
