#!/usr/bin/env node

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

spawn('node', ['--test', ...process.argv.slice(2), 'tests'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    DICPATH: fileURLToPath(new URL('../tests/dicts', import.meta.url)),
    WORDLIST: fileURLToPath(
      new URL('../tests/dicts/csaf_words.txt', import.meta.url)
    ),
  },
})
