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
      include: ['**/*.js'],
      exclude: ['tests/**', 'build/**', 'csaf/**', 'scripts/**'],
    },
  },
})
