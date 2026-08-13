import { readFile } from 'node:fs/promises'
import { MockAgent } from 'undici'

// Pulled out of oasis.js because undici has no browser build - keeping it
// separate lets oasis.js load this only via dynamic import when running under
// Node.

const extensionDataBaseUrl = new URL(
  '../../csaf/csaf_2.1/test/extension/data/valid/',
  import.meta.url
)

/**
 * Mocks GitHub raw-content requests for extension schemas via csafAjv's
 * dynamic loadSchema mechanism, so the test doesn't need real network access.
 *
 * @returns {Promise<MockAgent>}
 */
export async function extensionSchemaMockAgent() {
  const mockAgent = new MockAgent()
  mockAgent.disableNetConnect()

  const pool = mockAgent.get('https://raw.githubusercontent.com')
  for (const name of ['documentation-11', 'documentation-12']) {
    const content = await readFile(
      new URL(`${name}/${name}-content_1.0.0.json`, extensionDataBaseUrl),
      'utf-8'
    )
    pool
      .intercept({
        method: 'GET',
        path: `/oasis-tcs/csaf/refs/heads/master/csaf_2.1/extension/data/valid/${name}/${name}-content_1.0.0.json`,
      })
      .reply(200, content, {
        headers: { 'content-type': 'application/json' },
      })
      .persist()
  }

  return mockAgent
}
