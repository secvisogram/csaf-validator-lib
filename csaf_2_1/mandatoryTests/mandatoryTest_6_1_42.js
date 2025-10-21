import { PackageURL } from 'packageurl-js'
import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    branches: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
    product: {
      additionalProperties: true,
      optionalProperties: {
        product_identification_helper: {
          additionalProperties: true,
          optionalProperties: {
            purls: { elements: { type: 'string' } },
          },
        },
      },
    },
  },
})

const validateBranch = ajv.compile(branchSchema)

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_identification_helper: {
      additionalProperties: true,
      optionalProperties: {
        purls: { elements: { type: 'string' } },
      },
    },
  },
})

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match, it normally means that the input
  document does not validate against the csaf JSON schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: {
          elements: branchSchema,
        },
        full_product_names: {
          elements: fullProductNameSchema,
        },
        relationships: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              full_product_name: fullProductNameSchema,
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core').JTDDataType<typeof fullProductNameSchema>} FullProductName
 */

/**
 *
 * @param {PackageURL | null} firstPurl
 * @param {PackageURL} secondPurl
 * @return {boolean}
 */
function onlyDifferInQualifiers(firstPurl, secondPurl) {
  return (
    !!firstPurl &&
    firstPurl.type === secondPurl.type &&
    firstPurl.namespace === secondPurl.namespace &&
    firstPurl.name === secondPurl.name &&
    firstPurl.version === secondPurl.version
  )
}

/**
 * Validates all given PURLs and check whether the PURLs
 * differ only in qualifiers to the first URL
 *
 * @param {Array<string> | undefined} purls PURLs to check
 * @return {Array<number>} indexes of the PURLs that differ
 */
export function checkPurls(purls) {
  /** @type {Array<number>}*/
  const invalidPurls = []
  if (purls) {
    /** @type {Array<PackageURL | null>} */
    const packageUrls = purls.map((purl) => {
      try {
        return PackageURL.fromString(purl)
      } catch (e) {
        // ignore
        return null
      }
    })

    /**
     * @type {Array<PackageURL>}
     */
    if (packageUrls.length > 1) {
      const firstPurl = packageUrls[0]
      for (let i = 1; i < packageUrls.length; i++) {
        const packageUrl = packageUrls[i]
        if (!packageUrl || !onlyDifferInQualifiers(firstPurl, packageUrl)) {
          invalidPurls.push(i)
        }
      }
    }
  }
  return invalidPurls
}

/**
 * For each product_identification_helper object containing multiple purls,
 * it MUST be tested that the purls only differ in their qualifiers.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_42(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test ran and is
    finally returned by the function.
   */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc)) {
    return ctx
  }

  doc.product_tree?.branches?.forEach((branch, index) => {
    checkBranch(`/product_tree/branches/${index}`, branch)
  })

  doc.product_tree?.full_product_names?.forEach((fullProduceName, index) => {
    checkFullProductName(
      `/product_tree/full_product_names/${index}`,
      fullProduceName
    )
  })

  doc.product_tree?.relationships?.forEach((relationship, index) => {
    const fullProductName = relationship.full_product_name
    if (fullProductName) {
      checkFullProductName(
        `/product_tree/relationships/${index}/full_product_name`,
        fullProductName
      )
    }
  })

  return ctx

  /**
   *  Check whether the PURLs only differ in their qualifiers for a full product name.
   *
   * @param {string} prefix The instance path prefix of the "full product name". It is
   *    used to generate error messages.
   * @param {FullProductName} fullProductName The "full product name" object.
   */
  function checkFullProductName(prefix, fullProductName) {
    const invalidPurlsIndexes = checkPurls(
      fullProductName.product_identification_helper?.purls
    )
    invalidPurlsIndexes.forEach((invalidPurlIndex) => {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `${prefix}/product_identification_helper/purls/${invalidPurlIndex}`,
        message:
          'the PURL differs from the first PURL in other parts than just the qualifiers',
      })
    })
  }

  /**
   * Check whether the PURLs only differ in their qualifiers for the given branch object
   * and its branch children.
   *
   * @param {string} prefix The instance path prefix of the "branch". It is
   *    used to generate error messages.
   * @param {Branch} branch The "branch" object.
   */
  function checkBranch(prefix, branch) {
    const invalidPurlsIndexes = checkPurls(
      branch.product?.product_identification_helper?.purls
    )
    invalidPurlsIndexes.forEach((invalidPurlIndex) => {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `${prefix}/product/product_identification_helper/purls/${invalidPurlIndex}`,
        message:
          'the PURL differs from the first PURL in other parts than just the qualifiers',
      })
    })
    branch.branches?.forEach((branch, index) => {
      if (validateBranch(branch)) {
        checkBranch(`${prefix}/branches/${index}`, branch)
      }
    })
  }
}
