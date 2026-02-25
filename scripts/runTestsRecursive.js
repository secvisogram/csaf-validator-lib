#!/usr/bin/env node

/**
 * @file Script to recursively validate JSON files in a directory against given tests
 *
 * Usage: node <script-path>.js -d <directory> -t <test-name> [-c <csaf-version>] [-o <basename>] [-j <concurrency>] [-p <tasks-per-worker>]
 *
 *    -d <directory>
 *      Specifies the root directory to recursively search for .json files.
 *
 *    -t <test-name>
 *      Specifies the test(s) to run. See runTest.js for details.
 *
 *    -c <csaf-version> (default: 2.0)
 *      Specifies the csaf version to use. Allowed: `2.0` or `2.1`.
 *
 *    -o <basename>
 *      Optional. If provided, writes <basename>.json with full results and
 *      <basename>.html with a browsable report.
 *
 *    -j <concurrency>
 *      Number of worker threads to use (default: number of available CPUs).
 *
 *    -p <tasks-per-worker>
 *      Number of concurrent tasks per worker thread (default: 4).
 *
 */

import { readdir, writeFile } from 'fs/promises'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'node:url'
import { availableParallelism } from 'node:os'
import { EventEmitter } from 'node:events'
import { parseArgs } from 'node:util'
import assert from 'node:assert'
import { SingleBar, Presets } from 'cli-progress'
import Piscina from 'piscina'

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function collectJsonFiles(dir) {
  const results = []
  const queue = [dir]
  while (queue.length > 0) {
    const current = queue.pop()
    const entries = await readdir(current, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(current, entry.name)
      if (entry.isDirectory()) {
        queue.push(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        results.push(fullPath)
      }
    }
  }
  return results
}

/**
 * @param {object} data
 * @returns {string}
 */
function generateHtml(data) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CSAF Validation Report</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
    <style>
      .summary-card { min-width: 130px; }
      .error-list { font-size: 0.85em; }
      .toggle-btn { cursor: pointer; }
      mark { background: #fff3cd; padding: 0 2px; border-radius: 2px; }
    </style>
  </head>
  <body>
    <div class="container-fluid py-4">
      <h1 class="mb-1">CSAF Validation Report</h1>
      <div id="meta" class="text-muted small mb-4"></div>

      <div id="summary" class="d-flex flex-wrap gap-3 mb-4"></div>

      <div id="valid-section" class="mb-3" style="display:none!important">
        <h2>Valid Files</h2>
        <p id="valid-count"></p>
      </div>

      <div id="invalid-section">
        <h2>Invalid Files <span id="invalid-badge" class="badge text-bg-danger rounded-pill"></span></h2>
        <div class="mb-3">
          <input id="filter" type="search" class="form-control form-control-sm w-auto" placeholder="Filter by filename…">
        </div>
        <table class="table table-sm table-hover align-middle" id="invalid-table">
          <thead class="table-light">
            <tr>
              <th>File</th>
              <th class="text-end" style="white-space:nowrap">Failing tests</th>
            </tr>
          </thead>
          <tbody id="invalid-tbody"></tbody>
        </table>
        <p id="no-results" class="text-muted" style="display:none">No matching files.</p>
      </div>

      <div id="skipped-section" class="mt-3" style="display:none!important">
        <h2>Skipped <span id="skipped-badge" class="badge text-bg-secondary rounded-pill"></span></h2>
        <p class="text-muted small">Files that could not be parsed as JSON.</p>
        <ul id="skipped-list" class="list-unstyled small"></ul>
      </div>
    </div>

    <script>
    (async () => {
      const data = ${JSON.stringify(data)};
      const { meta, summary, results, skipped } = data;

      document.querySelector('#meta').innerHTML =
        'Run at <strong>' + meta.runAt + '</strong> &mdash; ' +
        'Directory: <code>' + meta.directory + '</code> &mdash; ' +
        'Test: <strong>' + meta.testName + '</strong> &mdash; ' +
        'CSAF version: <strong>' + meta.csafVersion + '</strong>';

      const cards = [
        { label: 'Total', value: summary.totalFiles, cls: 'bg-primary text-white' },
        { label: 'Valid', value: summary.validFiles, cls: 'bg-success text-white' },
        { label: 'Invalid', value: summary.invalidFiles, cls: 'bg-danger text-white' },
        { label: 'Skipped', value: summary.skippedFiles, cls: 'bg-secondary text-white' },
      ];
      document.querySelector('#summary').innerHTML = cards.map(c =>
        '<div class="card summary-card text-center ' + c.cls + '">' +
        '<div class="card-body py-2 px-3">' +
        '<div class="fs-3 fw-bold">' + c.value.toLocaleString() + '</div>' +
        '<div class="small">' + c.label + '</div>' +
        '</div></div>'
      ).join('');

      document.querySelector('#invalid-badge').textContent = summary.invalidFiles.toLocaleString();

      const invalidResults = results;

      if (skipped && skipped.length) {
        const skippedSection = document.querySelector('#skipped-section');
        skippedSection.style.removeProperty('display');
        document.querySelector('#skipped-badge').textContent = skipped.length;
        document.querySelector('#skipped-list').innerHTML =
          skipped.map(f => '<li><code>' + esc(f) + '</code></li>').join('');
      }

      const tbody = document.querySelector('#invalid-tbody');

      function renderRows(filter) {
        const q = filter.trim().toLowerCase();
        let shown = 0;
        tbody.innerHTML = '';
        for (const r of invalidResults) {
          if (q && !r.file.toLowerCase().includes(q)) continue;
          shown++;
          const failingTests = r.tests.filter(t => !t.isValid);
          const rowId = 'row-' + CSS.escape(r.file);
          const detailId = 'detail-' + CSS.escape(r.file);

          const errHtml = failingTests.map(t => {
            const items = [
              ...t.errors.map(e => '<li class="text-danger">' + esc(msgOf(e)) + '</li>'),
              ...t.warnings.map(w => '<li class="text-warning">' + esc(msgOf(w)) + '</li>'),
              ...t.infos.map(i => '<li class="text-info">' + esc(msgOf(i)) + '</li>'),
            ].join('');
            return '<div class="mb-1"><strong>' + esc(t.name) + '</strong><ul class="mb-0">' + items + '</ul></div>';
          }).join('');

          const tr = document.createElement('tr');
          tr.id = rowId;
          tr.innerHTML =
            '<td>' +
              '<span class="toggle-btn text-primary me-1" data-target="' + detailId + '" title="Toggle details">&#9654;</span>' +
              '<code>' + esc(r.file) + '</code>' +
            '</td>' +
            '<td class="text-end">' + failingTests.length + '</td>';

          const detailTr = document.createElement('tr');
          detailTr.id = detailId;
          detailTr.style.display = 'none';
          detailTr.innerHTML =
            '<td colspan="2"><div class="error-list ps-3 pb-2">' + errHtml + '</div></td>';

          tbody.appendChild(tr);
          tbody.appendChild(detailTr);
        }

        document.querySelector('#no-results').style.display = shown === 0 ? '' : 'none';
      }

      renderRows('');

      tbody.addEventListener('click', e => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        const detail = document.getElementById(btn.dataset.target);
        if (!detail) return;
        const open = detail.style.display !== 'none';
        detail.style.display = open ? 'none' : '';
        btn.innerHTML = open ? '&#9654;' : '&#9660;';
      });

      document.querySelector('#filter').addEventListener('input', e => {
        renderRows(e.target.value);
      });

      function esc(s) {
        return String(s)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }

      function msgOf(item) {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          return item.message ?? item.msg ?? JSON.stringify(item);
        }
        return String(item);
      }
    })();
    </script>
  </body>
</html>
`
}

/**
 * @param {object} params
 * @param {string} params.testName
 * @param {string} params.directory
 * @param {string} params.csafVersion
 * @param {string | undefined} params.outputBasename
 * @param {number} params.concurrency
 * @param {number} params.tasksPerWorker
 */
const main = async ({ testName, directory, csafVersion, outputBasename, concurrency, tasksPerWorker }) => {
  const files = await collectJsonFiles(directory)
  const total = files.length

  const pool = new Piscina({
    filename: resolve(dirname(fileURLToPath(import.meta.url)), 'runTestsRecursiveWorker.js'),
    minThreads: concurrency,
    maxThreads: concurrency,
    concurrentTasksPerWorker: tasksPerWorker,
    idleTimeout: Infinity,
  })

  let totalFiles = 0
  let validFiles = 0
  let invalidFiles = 0
  const skipped = []
  /** @type {{ file: string, tests: unknown[] }[]} */
  const results = []

  const bar = new SingleBar(
    {
      format:
        '{bar} {value}/{total} ({percentage}%)  \u2717 {invalidCount} invalid ({invalidPct}%)  ETA: {eta_formatted}',
      stream: process.stderr,
      etaBuffer: 2000,
      fps: 4,
    },
    Presets.shades_classic
  )
  bar.start(total, 0, { invalidCount: 0, invalidPct: '0.0' })

  const onResult = (result) => {
    if (result.skipped) {
      skipped.push(result.file)
    } else {
      totalFiles++
      if (result.isValid) {
        validFiles++
      } else {
        invalidFiles++
      }
      if (!result.isValid) {
        results.push({ file: result.file, tests: result.tests })
      }
    }
    const processed = totalFiles + skipped.length
    const invalidPct = processed > 0 ? ((invalidFiles / processed) * 100).toFixed(1) : '0.0'
    bar.increment({ invalidCount: invalidFiles, invalidPct })
  }

  let activeTasks = files.length
  const notify = new EventEmitter()

  for (const filePath of files) {
    pool.run({ filePath, testName, csafVersion }).then((result) => {
      onResult(result)
      activeTasks--
      if (activeTasks === 0) notify.emit('done')
    })
  }

  if (activeTasks > 0) {
    await new Promise((r) => notify.once('done', r))
  }
  await pool.destroy()
  bar.stop()

  const summary = {
    totalFiles,
    validFiles,
    invalidFiles,
    skippedFiles: skipped.length,
  }

  console.log(
    JSON.stringify(
      {
        directory,
        testName,
        csafVersion,
        ...summary,
      },
      null,
      2
    )
  )

  process.exitCode = invalidFiles > 0 ? 1 : 0

  if (outputBasename) {
    const jsonPath = outputBasename + '.json'
    const htmlPath = outputBasename + '.html'

    const output = {
      meta: {
        directory,
        testName,
        csafVersion,
        runAt: new Date().toISOString(),
      },
      summary,
      results,
      skipped,
    }

    await writeFile(jsonPath, JSON.stringify(output, null, 2), {
      encoding: 'utf-8',
    })
    await writeFile(htmlPath, generateHtml(output), { encoding: 'utf-8' })

    console.error(`Report written to ${jsonPath} and ${htmlPath}`)
  }
}

const { values: cliOptions } = parseArgs({
  options: {
    directory: {
      type: 'string',
      short: 'd',
    },
    'csaf-version': {
      type: 'string',
      short: 'c',
      default: '2.0',
    },
    test: {
      type: 'string',
      short: 't',
    },
    output: {
      type: 'string',
      short: 'o',
    },
    jobs: {
      type: 'string',
      short: 'j',
    },
    'tasks-per-worker': {
      type: 'string',
      short: 'p',
    },
  },
})

const directory = cliOptions.directory
const testName = cliOptions.test
assert(directory, 'Missing -d <directory>')
assert(testName, 'Missing -t <test-name>')

const csafVersion = cliOptions['csaf-version']
if (csafVersion !== '2.0' && csafVersion !== '2.1') throw new Error('Unknown CSAF version')

const outputBasename = cliOptions.output
const concurrency = cliOptions.jobs ? parseInt(cliOptions.jobs, 10) : availableParallelism()
const tasksPerWorker = cliOptions['tasks-per-worker'] ? parseInt(cliOptions['tasks-per-worker'], 10) : 4
await main({ directory, testName, csafVersion, outputBasename, concurrency, tasksPerWorker })
