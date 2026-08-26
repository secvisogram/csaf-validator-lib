import { PackageURL } from 'packageurl-js'
import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_identification_helper: {
      additionalProperties: true,
      optionalProperties: {
        cpe: { type: 'string' },
        purls: { elements: { type: 'string' } },
      },
    },
  },
})

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    name: { type: 'string' },
    branches: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
    product: fullProductNameSchema,
  },
})

const validateBranch = ajv.compile(branchSchema)

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
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof fullProductNameSchema>} FullProductName
 * @typedef {NonNullable<FullProductName['product_identification_helper']>} ProductIdentificationHelper
 * @typedef {{ category: string; name: string }} CategorizedBranchName
 */

/** @type {Record<number, string[]>} */
const CPE_INDEX_TO_CATEGORIES = {
  3: ['vendor'],
  4: ['product_name'],
  5: ['product_version'],
  6: ['patch_level', 'service_pack'],
  7: [], // index 7 = edition: no CSAF branch category corresponds to this CPE component
  8: ['language'],
  9: [], // index 9 = sw_edition: no CSAF branch category corresponds to this CPE component
  10: ['platform'],
  11: ['architecture'],
  12: [], // index 12 = other: no CSAF branch category corresponds to this CPE component
}

/** @type {Record<string, number>} */
const CATEGORY_TO_CPE_INDEX = Object.fromEntries(
  Object.entries(CPE_INDEX_TO_CATEGORIES).flatMap(([indexStr, categories]) =>
    categories.map((category) => [category, Number(indexStr)])
  )
)

/** @type {Record<string, keyof PackageURL>} */
const CATEGORY_TO_PURL_COMPONENT = {
  vendor: 'namespace',
  product_name: 'name',
  product_version: 'version',
}

// CPE 2.3 formatted string always consists of exactly 13 colon-separated parts.
const CPE_2_3_PART_COUNT = 13

/**
 * This implements the recommended test 6.2.42 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_42(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.product_tree?.branches?.forEach((branch, index) => {
    checkBranch(branch, `/product_tree/branches/${index}`, [], ctx.warnings)
  })

  return ctx
}

/**
 * @param {Branch} branch - The branch to check
 * @param {string} basePath - The base path in the document for the current branch
 * @param {CategorizedBranchName[]} categorizedBranchNames - The path of categories and names leading to the current branch
 * @param {Array<{ instancePath: string; message: string }>} warnings - The array to collect warnings
 * @param {boolean} hasMissingCategoryOrName - Is the current path incomplete (i.e., missing category or name)
 */
function checkBranch(
  branch,
  basePath,
  categorizedBranchNames,
  warnings,
  hasMissingCategoryOrName = false
) {
  if (!validateBranch(branch)) return

  const { category, name } = branch
  const currentCategorizedBranchName =
    category && name
      ? [...categorizedBranchNames, { category, name }]
      : categorizedBranchNames
  const currentHasMissingCategoryOrName =
    hasMissingCategoryOrName || !category || !name

  const productIdentificationHelper /** @type {ProductIdentificationHelper} */ =
    branch.product?.product_identification_helper
  if (productIdentificationHelper) {
    const productIdentificationHelperPath = `${basePath}/product/product_identification_helper`

    if (typeof productIdentificationHelper.cpe === 'string') {
      checkCpe(
        productIdentificationHelper.cpe,
        currentCategorizedBranchName,
        `${productIdentificationHelperPath}/cpe`,
        warnings,
        currentHasMissingCategoryOrName
      )
    }

    productIdentificationHelper.purls?.forEach((purlStr, purlIndex) => {
      if (typeof purlStr === 'string') {
        checkPurl(
          purlStr,
          currentCategorizedBranchName,
          `${productIdentificationHelperPath}/purls/${purlIndex}`,
          warnings
        )
      }
    })
  }

  branch.branches?.forEach((childBranch, childIndex) => {
    checkBranch(
      childBranch,
      `${basePath}/branches/${childIndex}`,
      currentCategorizedBranchName,
      warnings,
      currentHasMissingCategoryOrName
    )
  })
}

/**
 * @param {string} cpe - The CPE string to check
 * @param {CategorizedBranchName[]} categorizedBranchNames - The path of categories and names leading to the current branch
 * @param {string} instancePath - The path in the document for the current CPE
 * @param {Array<{ instancePath: string; message: string }>} warnings - The array to collect warnings
 * @param {boolean} hasMissingCategoryOrName - Is the current path incomplete (i.e., missing category or name)
 */
function checkCpe(
  cpe,
  categorizedBranchNames,
  instancePath,
  warnings,
  hasMissingCategoryOrName = false
) {
  if (!cpe.startsWith('cpe:2.3:')) return

  const parts = cpe.split(':')
  if (parts.length !== CPE_2_3_PART_COUNT) return

  const presentCategories = new Set(
    categorizedBranchNames.map(
      (categorizedBranchName) => categorizedBranchName.category
    )
  )

  for (const { category, name } of categorizedBranchNames) {
    const cpeIndex = CATEGORY_TO_CPE_INDEX[category]
    if (cpeIndex === undefined) continue

    const cpeValue = parts[cpeIndex]

    if (isCpeNotSet(cpeValue)) {
      warnings.push({
        instancePath,
        message: `CPE counterpart for branch category "${category}" is not set but branch name is "${name}"`,
      })
      continue
    }

    if (containsWildcard(cpeValue) && !containsWildcard(name)) {
      warnings.push({
        instancePath,
        message: `CPE counterpart for branch category "${category}" contains a wildcard but branch name "${name}" does not indicate one`,
      })
      continue
    }

    if (category === 'product_version') {
      if (normalizeCpeValue(cpeValue) !== normalizeCpeValue(name)) {
        warnings.push({
          instancePath,
          message: `CPE version "${cpeValue}" does not match branch version "${name}"`,
        })
      }
    }
  }

  if (!hasMissingCategoryOrName) {
    for (const [indexStr, categories] of Object.entries(
      CPE_INDEX_TO_CATEGORIES
    )) {
      const index = Number(indexStr)
      const cpeValue = parts[index]

      if (!isCpeNotSet(cpeValue)) {
        const hasCorrespondingBranch = categories.some((category) =>
          presentCategories.has(category)
        )
        if (!hasCorrespondingBranch) {
          const categoryHint =
            categories.length > 0 ? ` (${categories.join(' / ')})` : ''
          warnings.push({
            instancePath,
            message:
              `CPE has extra information at index ${index} ("${cpeValue}") with no corresponding branch ` +
              `category${categoryHint}`,
          })
        }
      }
    }
  }
}

/**
 * @param {string} purlStr - The PURL string to check
 * @param {CategorizedBranchName[]} categorizedBranchNames - The path of categories and names leading to the current branch
 * @param {string} instancePath - The path in the document for the current PURL
 * @param {Array<{ instancePath: string; message: string }>} warnings - The array to collect warnings
 */
function checkPurl(purlStr, categorizedBranchNames, instancePath, warnings) {
  let purl
  try {
    purl = PackageURL.fromString(purlStr)
  } catch {
    return
  }

  for (const { category, name } of categorizedBranchNames) {
    const purlComponent = CATEGORY_TO_PURL_COMPONENT[category]
    if (!purlComponent) continue

    const purlValue = /** @type {string | null | undefined} */ (
      purl[purlComponent]
    )

    if (!purlValue) {
      warnings.push({
        instancePath,
        message: `PURL "${purlComponent}" is not set but branch category "${category}" has value "${name}"`,
      })
      continue
    }

    if (containsWildcard(purlValue) && !containsWildcard(name)) {
      warnings.push({
        instancePath,
        message: `PURL "${purlComponent}" contains a wildcard but branch name "${name}" does not indicate one`,
      })
      continue
    }

    if (category === 'product_version' && purlValue !== name) {
      warnings.push({
        instancePath,
        message: `PURL version "${purlValue}" does not match branch version "${name}"`,
      })
    }
  }
}

/**
 * @param {string} value
 */
function isCpeNotSet(value) {
  return value === '*' || value === '-'
}

/**
 * @param {string} value
 */
function containsWildcard(value) {
  return /(?<!\\)[*?]/.test(value)
}

/**
 * @param {string} value
 */
function normalizeCpeValue(value) {
  return value.toLowerCase().replace(/ /g, '_')
}
