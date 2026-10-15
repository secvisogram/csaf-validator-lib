// Real Node (even under Vite/Vitest's transform pipeline) always has a fully-populated
// `process.versions.node`. Vitest's browser mode (real Playwright browser context) has no
// such global - used to skip tests that exercise Node-only APIs (e.g. the `hunspell` CLI
// via `node:child_process`) without excluding the whole file from the browser project.
export default typeof process === 'undefined' || !process.versions?.node
