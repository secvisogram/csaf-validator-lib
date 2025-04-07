#!/usr/bin/env node

import { writeFile, readFile } from 'node:fs/promises'
import prettier from 'prettier'
import xml2js from 'xml2js'
import { cwecMap } from '../lib/cwec.js'

/**
 * This script can be used to loop over all cwe files containing the entire information of all cwe versions
 * and extract only the properties relevant for the tests
 *
 * The input files containing the entire information of all cwe versions
 * can be downloaded from https://cwe.mitre.org/data/archive.html
 * Then create a cwe_raw_data folder and place these files there
 *
 * If a new cwe version is available, add the respective entry to the cwecMap
 *
 * After that, you can run this script
 *
 * */

const cwec = Array.from(cwecMap.keys())

for (const version of cwec) {
  const INPUT_FILE = `../lib/cwe_raw_data/cwec_v${version}.xml`
  const OUTPUT_FILE = `../lib/cwec/${version}.js`

  /**
   * @typedef {{ ID: string; Name: string, Status: string, Mapping_Notes: {Usage: string} }} Weakness
   * @typedef {{Weaknesses: {Weakness: Array<Weakness>}}} Weaknesses
   * @typedef {{Date: string}} Date
   */

  const parser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true,
    explicitRoot: false,
  })

  const fileXML = await parser.parseStringPromise(
    await readFile(INPUT_FILE, 'utf-8')
  )

  const json = {
    date: fileXML.Date,
    weaknesses: fileXML.Weaknesses.Weakness.map(
      (/** @type {Weakness} */ weakness) => {
        return {
          id: `CWE-${weakness.ID}`,
          name: weakness.Name,
          status: weakness.Status,
          // Please note that the Usage property only exists in cwe version 4.12 and newer
          usage: weakness.Mapping_Notes?.Usage,
        }
      }
    ),
  }

  await writeFile(
    OUTPUT_FILE,
    prettier.format(`export default (${JSON.stringify(json)})`, {
      ...(await prettier.resolveConfig(OUTPUT_FILE)),
      filepath: OUTPUT_FILE,
    })
  )
}
