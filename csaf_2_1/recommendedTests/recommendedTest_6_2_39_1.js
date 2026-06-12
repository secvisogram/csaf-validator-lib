import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        category: { type: 'string' },
      },
    },
  },
  optionalProperties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          product_status: {
            additionalProperties: true,
            optionalProperties: {
              first_affected: { elements: { type: 'string' } },
              known_affected: { elements: { type: 'string' } },
              last_affected: { elements: { type: 'string' } },
              fixed: { elements: { type: 'string' } },
              first_fixed: { elements: { type: 'string' } },
            },
          },
          remediations: {
            elements: {
              additionalProperties: true,
              properties: {
                category: { type: 'string' },
              },
              optionalProperties: {
                product_ids: { elements: { type: 'string' } },
              },
            },
          },
        },
      },
    },
  },
})

const validateSchema = ajv.compile(inputSchema)

/** Remediation categories that indicate no fix is expected → skip the check for this product */
const SKIP_CATEGORIES = new Set([
  'fix_planned',
  'no_fix_planned',
  'none_available',
])

/** Remediation categories that indicate a fix might exist → MUST NOT skip the check */
const MUST_NOT_SKIP_CATEGORIES = new Set(['vendor_fix'])

/**
 * This implements the recommended test 6.2.39.1 of the CSAF 2.1 standard.
 *
 * For each product listed in the product status group "affected" in any vulnerability,
 * it tests that a corresponding fixed version is listed in the same vulnerability.
 * The test is skipped per-product if a remediation with category fix_planned,
 * no_fix_planned or none_available refers to that product. It MUST NOT be skipped
 * if a vendor_fix remediation refers to the product.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_39_1(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (
    !validateSchema(doc) ||
    doc.document.category !== 'csaf_security_advisory'
  ) {
    return ctx
  }

  // TODO: Type festlegen, z.B. via inputSchema
  const vulnerabilities = doc.vulnerabilities ?? []

  vulnerabilities.forEach((vulnerability, vulnIndex) => {
    // TODO: Type festlegen, z.B. via inputSchema
    const productStatus = vulnerability.product_status ?? {}
    // TODO: Type festlegen, z.B. via inputSchema
    const remediations = vulnerability.remediations ?? []

    // Collect all affected product IDs (the "affected" group)
    // TODO: Type festlegen, z.B. via inputSchema
    const affectedProductIds = [
      ...(productStatus.first_affected ?? []),
      ...(productStatus.known_affected ?? []),
      ...(productStatus.last_affected ?? []),
    ]

    if (affectedProductIds.length === 0) return

    // Check whether any fixed product version is listed in this vulnerability.
    // "Corresponding version" does not require the same product ID – affected and
    // fixed products typically have different IDs (e.g. different version numbers).
    // Without product-tree traversal we cannot determine correspondence more
    // precisely, so we accept any entry in the fixed group as sufficient.
    const hasAnyFixed =
      (productStatus.fixed?.length ?? 0) > 0 ||
      (productStatus.first_fixed?.length ?? 0) > 0

    affectedProductIds.forEach((productId) => {
      // Find all remediations that reference this product directly via product_ids
      const productRemediations = remediations.filter((r) =>
        r.product_ids?.includes(productId)
      )

      // A vendor_fix remediation indicates a fix is expected for this product
      // → MUST NOT skip, regardless of other indicators
      const hasMustNotSkip = productRemediations.some((r) =>
        MUST_NOT_SKIP_CATEGORIES.has(r.category)
      )

      if (hasMustNotSkip) {
        if (!hasAnyFixed) {
          ctx.warnings.push({
            instancePath: `/vulnerabilities/${vulnIndex}/product_status`,
            message:
              `Product "${productId}" is listed as affected but has no corresponding fixed product. ` +
              `A remediation with category "vendor_fix" exists, indicating that a fixed version might be available.`,
          })
        }
        return
      }

      // A skip-category remediation means no fix is expected → skip (no warning)
      const hasSkipIndicator = productRemediations.some((r) =>
        SKIP_CATEGORIES.has(r.category)
      )

      if (hasSkipIndicator) return

      // A fixed product version is present in this vulnerability → pass
      if (hasAnyFixed) return

      // No fixed product and no skip indicator → warn
      ctx.warnings.push({
        instancePath: `/vulnerabilities/${vulnIndex}/product_status`,
        message: `Product "${productId}" is listed as affected but has no corresponding fixed product in the same vulnerability.`,
      })
    })
  })

  return ctx
}
