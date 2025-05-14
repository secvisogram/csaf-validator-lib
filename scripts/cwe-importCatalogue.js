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
   * @typedef {{Catalog_Date: string}} Catalog_Date
   */

  const parser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true,
    explicitRoot: false,
  })

  const fileXML = await parser.parseStringPromise(
    await readFile(INPUT_FILE, 'utf-8')
  )

  /*
   * The release date of CWE v1.0 is missing in the .xml file describing its content.
   * Therefore, its release date is hard coded here.
   * */
  let firstCweVersionReleaseDate = undefined
  if (version === '1.0') {
    firstCweVersionReleaseDate = '2008-09-09'
  }
  const json = {
    /*
     * For v3.0 and newer, the respective property is named "Date", for older versions its "Catalog_Date".
     * For v1.0 its missing, use firstCweVersionReleaseDate (see above).
     * */
    date: fileXML.Date || fileXML.Catalog_Date || firstCweVersionReleaseDate,
    weaknesses: fileXML.Weaknesses.Weakness.map(
      (/** @type {Weakness} */ weakness) => {
        return {
          id: `CWE-${weakness.ID}`,
          name: weakness.Name,
          status: weakness.Status,
          /*
           * Please note that the Usage property only exists in cwe v4.12 and newer.
           * Nevertheless this field must not be missing in the CWE catalogue for earlier versions,
           * since this would lead to errors in the respective optional tests.
           * Therefore the value null is assigned for the Usage property for earlier versions.
           */
          usage: weakness.Mapping_Notes?.Usage || null,
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
