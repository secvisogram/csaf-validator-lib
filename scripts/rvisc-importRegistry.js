#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import prettier from 'prettier'

/**
 * Converts the RVISC registry (`csaf/registry/id/registry.json`, part of
 * the `csaf/` git subtree and excluded from the npm package) into a plain
 * ESM module (`rvisc.js`) that works in Node and in the browser.
 *
 * Run again after `csaf/registry/id/registry.json` was updated:
 *
 *   node scripts/rvisc-importRegistry.js
 */

const REGISTRY_FILE = 'csaf/registry/id/registry.json'
const OUTPUT_FILE = 'rvisc.js'

const json = JSON.parse(await readFile(REGISTRY_FILE, 'utf-8'))

await writeFile(
  OUTPUT_FILE,
  prettier.format(
    `// This file is generated from ${REGISTRY_FILE} by scripts/rvisc-importRegistry.js.
            // Do not edit by hand.\n\nconst rvisc = (${JSON.stringify(json)})\n
            export default rvisc\n\nexport const entries = rvisc.entries`,
    {
      ...(await prettier.resolveConfig(OUTPUT_FILE)),
      filepath: OUTPUT_FILE,
    }
  )
)
