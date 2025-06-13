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
        full_product_names: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              product_identification_helper: {
                additionalProperties: true,
                optionalProperties: {
                  serial_numbers: {
                    elements: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        relationships: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              full_product_name: {
                additionalProperties: true,
                optionalProperties: {
                  product_identification_helper: {
                    additionalProperties: true,
                    optionalProperties: {
                      serial_numbers: {
                        elements: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * Checks if a serial number contains multiple unescaped stars.
 * 
 * @param {string} serialNumber The serial number to check
 * @returns {boolean} True if the serial number is valid (does not contain multiple unescaped stars), false otherwise
 */
export const isValidSerialNumber = (serialNumber) => {
  // Count unescaped stars
  let count = 0;
  let escaped = false;
  
  for (let i = 0; i < serialNumber.length; i++) {
    if (escaped) {
      // Previous character was a backslash, so this character is escaped
      escaped = false;
      continue;
    }
    
    if (serialNumber[i] === '\\') {
      // This is a backslash, so the next character will be escaped
      escaped = true;
      continue;
    }
    
    if (serialNumber[i] === '*') {
      // This is an unescaped star
      count++;
      if (count > 1) {
        // Found multiple unescaped stars
        return false;
      }
    }
  }
  
  return true;
}

/**
 * This implements the mandatory test 6.1.44 of the CSAF 2.1 standard.
 * It checks that serial numbers do not contain multiple unescaped stars.
 *
 * @param {any} doc
 */
export function mandatoryTest_6_1_44(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test ran and is
    finally returned by the function.
   */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc)) return ctx

  /**
   * Validates the given serial number and generates an error on
   * `ctx` if it is not valid.
   *
   * @param {string} serialNumber The serial number to validate
   * @param {string} path The json path to the serial number
   */
  const validateSerialNumber = (serialNumber, path) => {
    if (!isValidSerialNumber(serialNumber)) {
      ctx.errors.push({
        instancePath: path,
        message: 'serial number contains multiple unescaped stars',
      })
      ctx.isValid = false
    }
  }

  // Check serial numbers in full_product_names
  doc.product_tree?.full_product_names?.forEach((product, productIndex) => {
    product.product_identification_helper?.serial_numbers?.forEach(
      (serialNumber, serialIndex) => {
        validateSerialNumber(
          serialNumber,
          `/product_tree/full_product_names/${productIndex}/product_identification_helper/serial_numbers/${serialIndex}`
        )
      }
    )
  })

  // Check serial numbers in relationships
  doc.product_tree?.relationships?.forEach((relationship, relationshipIndex) => {
    relationship.full_product_name?.product_identification_helper?.serial_numbers?.forEach(
      (serialNumber, serialIndex) => {
        validateSerialNumber(
          serialNumber,
          `/product_tree/relationships/${relationshipIndex}/full_product_name/product_identification_helper/serial_numbers/${serialIndex}`
        )
      }
    )
  })

  // Check serial numbers in branches (recursive function)
  const checkBranches = (
    /** @type {any[] | undefined} */ branches, 
    /** @type {string} */ path
  ) => {
    branches?.forEach((/** @type {any} */ branch, /** @type {number} */ branchIndex) => {
      // Check product in this branch
      branch.product?.product_identification_helper?.serial_numbers?.forEach(
        (/** @type {string} */ serialNumber, /** @type {number} */ serialIndex) => {
          validateSerialNumber(
            serialNumber,
            `${path}/${branchIndex}/product/product_identification_helper/serial_numbers/${serialIndex}`
          )
        }
      )

      // Check nested branches
      if (branch.branches) {
        checkBranches(branch.branches, `${path}/${branchIndex}/branches`)
      }
    })
  }

  // Start checking branches from the root
  checkBranches(doc.product_tree?.branches, '/product_tree/branches')

  return ctx
}
