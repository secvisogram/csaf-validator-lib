/**
 * Traverses a simplified JSON-path-like expression and executes a callback on
 * every matching node.
 *
 * Path syntax supported here:
 * - `/foo/bar` for object traversal
 * - `/items[]/url` for array traversal
 * - '/items[*]/url` for recursive array traversal
 * - combinations of all of the above
 *
 * The callback receives a JSON Pointer-like `instancePath` for each match.
 *
 * @param {unknown} root - Root object to traverse.
 * @param {string} path - Traversal path, for example
 *   `/document/acknowledgments[]/urls[]`.
 * @param {(instancePath: string, value: unknown) => Promise<void>} onCheck
 *   Callback invoked for each matched value.
 */
export async function walkPath(root, path, onCheck) {
  return walk([], path.split('/').slice(1), root)

  /**
   * The actual recursive function.
   *
   * @param {string[]} resolvedSegments
   * @param {string[]} remainingSegments
   * @param {unknown} node
   */
  async function walk(resolvedSegments, remainingSegments, node) {
    if (node == null) return
    const keyEntry = remainingSegments[0]

    if (!keyEntry) {
      // Reached the end of the path: call the callback now ...

      await onCheck('/' + resolvedSegments.join('/'), node)
    } else if (keyEntry.endsWith('[*]')) {
      // ... Recursive-descent array: visit every element and re-apply this same
      // segment on each element to handle arbitrary nesting depth.

      const arrayName = keyEntry.slice(0, -3)
      /** @type {unknown} */
      const array = Reflect.get(node, arrayName)

      if (Array.isArray(array)) {
        for (const [elementIndex, element] of array.entries()) {
          const nextResolved = [
            ...resolvedSegments,
            arrayName,
            String(elementIndex),
          ]
          // ... Continue with the rest of the path at this depth
          await walk(nextResolved, remainingSegments.slice(1), element)
          // ... Recurse deeper into same-named sub-arrays
          await walk(nextResolved, remainingSegments, element)
        }
      }
    } else if (keyEntry.endsWith('[]')) {
      // ... Array entry: iterate through all the elements.

      const arrayName = keyEntry.split('[')[0]
      /** @type {unknown} */
      const array = Reflect.get(node, arrayName)

      if (Array.isArray(array)) {
        for (const [elementIndex, element] of array?.entries() ?? []) {
          await walk(
            [...resolvedSegments, arrayName, String(elementIndex)],
            [...remainingSegments.slice(1)],
            element
          )
        }
      }
    } else {
      // ... Otherwise we recurse deeper
      await walk(
        [...resolvedSegments, keyEntry],
        remainingSegments.slice(1),
        Reflect.get(node, keyEntry)
      )
    }
  }
}
