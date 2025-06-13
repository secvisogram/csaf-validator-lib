import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: {
          elements: {
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * Validates if a product version range name complies with the rules.
 * According to the specification, the name must obey one of these options:
 * 1. Version Range Specifier (vers) in canonical form
 * 2. Vers-like Specifier (vls) which uses only the <version-constraint> part
 *
 * @param {string} name The name to validate
 * @returns {{isValid: boolean, error: string | null}} Validation result
 */
export const isValidProductVersionRangeName = (name) => {
  // Check if it's a vers specification (canonical form)
  if (name.startsWith('vers:')) {
    // vers must be in canonical form
    // Format: vers:<versioning-scheme>/<version-constraint>
    const versRegex = /^vers:([a-z0-9]+)\/(.+)$/
    const match = versRegex.exec(name)
    
    if (!match) {
      return {
        isValid: false,
        error: 'Invalid vers format. Expected format: vers:<versioning-scheme>/<version-constraint>',
      }
    }
    
    // Special case for "all versions"
    if (name === 'vers:all/*') {
      return { isValid: true, error: null }
    }
    
    // Check if versioning scheme is valid (simple check, not exhaustive)
    const scheme = match[1]
    if (!scheme) {
      return {
        isValid: false,
        error: 'Missing versioning scheme in vers specification',
      }
    }
    
    // Check if version constraint is present
    const constraint = match[2]
    if (!constraint) {
      return {
        isValid: false,
        error: 'Missing version constraint in vers specification',
      }
    }
    
    return { isValid: true, error: null }
  } else {
    // It should be a vers-like specifier (vls)
    // This is a fallback option and should only contain the <version-constraint> part
    // Since the exact format of vls is not strictly defined and it's a fallback,
    // we'll do a basic check to ensure it looks like a version constraint
    
    // For vers-like specifier (vls), the format should be more strict
    // It should start with a version constraint operator or have proper operator placement
    // Examples of valid vls: "<=2", "<4.2", ">=8.1.5", ">10.9a|!=10.9c|<=10.9k"
    // Examples of invalid vls: "all versions < 4.2.0", "version 3", "latest"
    
    // Check if it's a properly formatted version constraint
    // The string should start with a constraint operator or have operators in the right places
    const validVlsPattern = /^([<>=!][=]?[\w\d\.\-]+)(\|([<>=!][=]?[\w\d\.\-]+))*$/
    
    if (!validVlsPattern.test(name)) {
      return {
        isValid: false,
        error: 'Invalid vers-like specifier (vls). Should be a properly formatted version constraint',
      }
    }
    
    return { isValid: true, error: null }
  }
}

/**
 * Recursively processes branches to find and validate product_version_range names.
 *
 * @param {Array<any>} branches The branches array to process
 * @param {string} path The current JSON path for error reporting
 * @param {{ errors: Array<{ instancePath: string; message: string }>; isValid: boolean }} ctx The context object for accumulating errors
 */
const processBranches = (branches, path, ctx) => {
  if (!branches || !Array.isArray(branches)) return
  
  branches.forEach((branch, index) => {
    const currentPath = `${path}/${index}`
    
    if (branch.category === 'product_version_range') {
      const result = isValidProductVersionRangeName(branch.name)
      if (!result.isValid) {
        ctx.errors.push({
          instancePath: `${currentPath}/name`,
          message: result.error || 'invalid product version range name',
        })
        ctx.isValid = false
      }
    }
    
    // Recursively process nested branches
    if (branch.branches && Array.isArray(branch.branches)) {
      processBranches(branch.branches, `${currentPath}/branches`, ctx)
    }
  })
}

/**
 * This implements the mandatory test 6.1.50 of the CSAF 2.1 standard.
 * It checks if product version range names comply with the rules.
 *
 * @param {any} doc The CSAF document to validate
 */
export function mandatoryTest_6_1_50(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test ran and is
    finally returned by the function.
   */
  const ctx = {
    errors: /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc)) return ctx

  // Process branches in product_tree if they exist
  // @ts-ignore - We know doc has product_tree property if validate passes
  if (doc.product_tree && doc.product_tree.branches) {
    // @ts-ignore - We know doc.product_tree.branches exists from the condition above
    processBranches(doc.product_tree.branches, '/product_tree/branches', ctx)
  }

  return ctx
}
