import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

// The OASIS fixture-driven tests (tests/oasis.js, tests/csaf_2_1/oasis.js) run
// informativeTest_6_3_8 without a hunspell mock, so they exercise the real
// `hunspell` CLI. These env vars point hunspell at the dictionary bundled in
// tests/dicts.
const hunspellEnv = {
  DICPATH: fileURLToPath(new URL('./tests/dicts', import.meta.url)),
  WORDLIST: fileURLToPath(
    new URL('./tests/dicts/csaf_words.txt', import.meta.url)
  ),
}

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          globals: true,
          include: ['tests/*.js', 'tests/csaf_2_1/*.js'],
          env: hunspellEnv,
        },
      },
      {
        test: {
          name: 'browser',
          globals: true,
          include: ['tests/*.js', 'tests/csaf_2_1/*.js'],
          // Only genuinely Node-only test content: `undici`'s `MockAgent`-based
          // network mocking. The other Node-only content (real `hunspell` CLI
          // in the OASIS 6.3.8 branches) is skipped at runtime instead, via
          // tests/shared/isBrowserRuntime.js, since it's reached generically
          // and can't be isolated to a whole excluded file.
          exclude: ['tests/networkMockedInformativeTests.js'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      // No `include` here: Vitest then only reports files that were
      // actually imported during the test run (matching the old
      // mocha/nyc behavior), instead of listing every matching file
      // (including untouched ones) as `include` would.
      exclude: [
        'tests/**',
        'build/**',
        'csaf/**',
        'scripts/**',
        // Pure re-export "barrel" files (only `export ... from '...'`
        // statements, no logic of their own). Neither v8 nor istanbul can
        // attach a statement counter to bare re-export syntax, so these
        // always report 0/0 statements - present as an empty entry (v8) or
        // omitted entirely (istanbul). Excluding them keeps the report free
        // of these meaningless empty/0% entries; the real logic they
        // re-export is still fully measured at its original location.
        'basic.js',
        'extended.js',
        'full.js',
        'mandatoryTests.js',
        'optionalTests.js',
        'informativeTests.js',
        'schemaTests.js',
        'hunspell.js',
        'strip.js',
        'validate.js',
        'lib/mandatoryTests.js',
        'lib/optionalTests.js',
        'lib/informativeTests.js',
        'lib/schemaTests.js',
        'lib/shared/csafHelpers.js',
        'csaf_2_1/basic.js',
        'csaf_2_1/extended.js',
        'csaf_2_1/full.js',
        'csaf_2_1/mandatoryTests.js',
        'csaf_2_1/recommendedTests.js',
        'csaf_2_1/informativeTests.js',
        'csaf_2_1/schemaTests.js',
        // Vendored/generated pure-data modules (JSON schemas, CWE/BCP-47
        // tables, translation strings) authored as `export default {...}`
        // literals with no other logic. Same 0/0-statement issue as above.
        'schemas/**',
        'lib/cwec/**',
        'lib/cwec.js',
        'lib/shared/cwec.js',
        'lib/shared/bcpLanguageTagChecker/**',
        'lib/language_specific_translation/**',
        'csaf_2_1/csafAjv/**',
        '**/schemaTests/**/schema.js',
        'lib/shared/first',
      ],
    },
  },
})
