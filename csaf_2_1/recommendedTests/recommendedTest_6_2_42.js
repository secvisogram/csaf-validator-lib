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
 * @typedef {{ category: string; name: string }} BranchPathEntry
 */

/** @type {Record<string, number>} */
const CATEGORY_TO_CPE_INDEX = {
  vendor: 3,
  product_name: 4,
  product_version: 5,
  patch_level: 6,
  service_pack: 6,
  language: 8,
  platform: 10,
  architecture: 11,
}

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

/** @type {Record<string, string>} */
const CATEGORY_TO_PURL_COMPONENT = {
  vendor: 'namespace',
  product_name: 'name',
  product_version: 'version',
}

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
 * @param {Branch} branch
 * @param {string} basePath
 * @param {BranchPathEntry[]} categorizedStrings
 * @param {Array<{ instancePath: string; message: string }>} warnings
 * @param {boolean} partialPath
 */
function checkBranch(
  branch,
  basePath,
  categorizedStrings,
  warnings,
  partialPath = false
) {
  if (!validateBranch(branch)) return

  const { category, name } = branch
  const currentCategorizedStrings =
    category && name
      ? [...categorizedStrings, { category, name }]
      : categorizedStrings
  const currentPartialPath = partialPath || !category || !name

  const pih /** @type {ProductIdentificationHelper} */ =
    branch.product?.product_identification_helper
  if (pih) {
    const pihPath = `${basePath}/product/product_identification_helper`

    if (typeof pih.cpe === 'string') {
      checkCpe(
        pih.cpe,
        currentCategorizedStrings,
        `${pihPath}/cpe`,
        warnings,
        currentPartialPath
      )
    }

    pih.purls?.forEach((purlStr, purlIndex) => {
      if (typeof purlStr === 'string') {
        checkPurl(
          purlStr,
          currentCategorizedStrings,
          `${pihPath}/purls/${purlIndex}`,
          warnings
        )
      }
    })
  }

  branch.branches?.forEach((childBranch, childIndex) => {
    checkBranch(
      childBranch,
      `${basePath}/branches/${childIndex}`,
      currentCategorizedStrings,
      warnings,
      currentPartialPath
    )
  })
}

/**
 * @param {string} cpe
 * @param {BranchPathEntry[]} categorizedStrings
 * @param {string} instancePath
 * @param {Array<{ instancePath: string; message: string }>} warnings
 * @param {boolean} partialPath
 */
function checkCpe(
  cpe,
  categorizedStrings,
  instancePath,
  warnings,
  partialPath = false
) {
  if (!cpe.startsWith('cpe:2.3:')) return

  const parts = cpe.split(':')
  if (parts.length !== 13) return

  const presentCategories = new Set(categorizedStrings.map((b) => b.category))

  for (const { category, name } of categorizedStrings) {
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

  if (!partialPath) {
    for (const [indexStr, categories] of Object.entries(
      CPE_INDEX_TO_CATEGORIES
    )) {
      const index = Number(indexStr)
      const cpeValue = parts[index]

      if (!isCpeNotSet(cpeValue)) {
        const hasCorrespondingBranch = categories.some((cat) =>
          presentCategories.has(cat)
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
 * @param {string} purlStr
 * @param {BranchPathEntry[]} categorizedStrings
 * @param {string} instancePath
 * @param {Array<{ instancePath: string; message: string }>} warnings
 */
function checkPurl(purlStr, categorizedStrings, instancePath, warnings) {
  let purl
  try {
    purl = PackageURL.fromString(purlStr)
  } catch {
    return
  }

  for (const { category, name } of categorizedStrings) {
    const purlComponent = CATEGORY_TO_PURL_COMPONENT[category]
    if (!purlComponent) continue

    const purlValue = /** @type {string | null | undefined} */ (
      purl[/** @type {keyof PackageURL} */ (purlComponent)]
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
