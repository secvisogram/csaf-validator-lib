import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    name: { type: 'string' },
    product_id: { type: 'string' },
  },
})

const subpathSchema = /** @type {const} */ ({
  additionalProperties: false,
  optionalProperties: {
    category: { type: 'string' },
    next_product_reference: { type: 'string' },
  },
})

const productPathSchema = /** @type {const} */ ({
  additionalProperties: false,
  properties: {
    beginning_product_reference: { type: 'string' },
    full_product_name: fullProductNameSchema,
    subpaths: {
      elements: subpathSchema,
    },
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
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        product_paths: {
          elements: productPathSchema,
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof productPathSchema>} ProductPath
 * @typedef {{dependencies: Array<{ productId: string, pathIndex: number, type: "main" | "sub", subIndex: number | null }> }} GraphNode
 * @typedef {Map<string, GraphNode>} DependencyGraph
 * @typedef {{cycleProductId: string, pathIndex: number, type: string, subIndex: number | null } | null} CircularDependency
 */

/**
 * This implements the mandatory test 6.1.3 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function mandatoryTest_6_1_3(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc)) {
    return ctx
  }

  if (!Array.isArray(doc.product_tree?.product_paths)) {
    return ctx
  }

  const productPaths = doc.product_tree.product_paths
  const graph = buildDependencyGraph(productPaths)

  const visited = new Set()
  for (const [productId] of graph) {
    if (!visited.has(productId)) {
      /** @type {CircularDependency} */
      const circle = hasCircle(productId, graph, visited)
      if (circle) {
        ctx.isValid = false
        const instancePath =
          circle.type === 'sub'
            ? `/product_tree/product_paths/${circle.pathIndex}/subpaths/${circle.subIndex}/next_product_reference`
            : `/product_tree/product_paths/${circle.pathIndex}/full_product_name/product_id`

        ctx.errors.push({
          instancePath,
          message: `circular reference detected for product_id: ${circle.cycleProductId}`,
        })
      }
    }
  }

  return ctx
}

/**
 * Adds a directed edge from `from` to `to` in the graph. The edge is annotated with the path index and type.
 * @param {DependencyGraph} graph
 * @param {string} from
 * @param {string} to
 * @param {number} pathIndex
 * @param {"main" | "sub"} type the 'type' specifies is it from the main part of a product_path or from a subpath
 * @param {number | null} subIndex
 */
function addEdge(graph, from, to, pathIndex, type, subIndex = null) {
  if (!graph.has(from)) {
    graph.set(from, { dependencies: [] })
  }

  const deps = graph.get(from)?.dependencies

  const exists = deps?.some(
    (d) => d.productId === to && d.pathIndex === pathIndex
  )

  if (!exists) {
    deps?.push({ productId: to, pathIndex, type, subIndex })
  }
}

/**
 * Builds a dependency graph from the given product paths.
 * @param {ProductPath[]} productPaths
 */
function buildDependencyGraph(productPaths) {
  /** @type {DependencyGraph} */
  const graph = new Map()

  productPaths.forEach((path, index) => {
    const beginningProductReference = path.beginning_product_reference
    const productId = path.full_product_name.product_id

    if (!beginningProductReference || !productId) return

    addEdge(graph, productId, beginningProductReference, index, 'main')

    path.subpaths?.forEach((sub, subIndex) => {
      if (sub.next_product_reference) {
        addEdge(
          graph,
          productId,
          sub.next_product_reference,
          index,
          'sub',
          subIndex
        )
      }
    })
  })
  return graph
}

/**
 * Detects if there is a circular reference starting from the given productId in the dependency graph.
 * @param {string} productId
 * @param {DependencyGraph} graph
 * @param {Set<string>} visited
 * @param {Set<string>} recursionStack
 * @returns {CircularDependency}
 */
function hasCircle(
  productId,
  graph,
  visited = new Set(),
  recursionStack = new Set()
) {
  if (visited.has(productId)) return null

  visited.add(productId)
  recursionStack.add(productId)
  const node = graph.get(productId)

  if (node) {
    for (const dep of node.dependencies) {
      if (recursionStack.has(dep.productId)) {
        return {
          cycleProductId: dep.productId,
          pathIndex: dep.pathIndex,
          type: dep.type,
          subIndex: dep.subIndex ?? null,
        }
      }
      const result = hasCircle(dep.productId, graph, visited, recursionStack)
      if (result) return result
    }
  }

  recursionStack.delete(productId)
  return null
}
