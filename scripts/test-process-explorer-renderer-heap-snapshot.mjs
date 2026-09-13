import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requireTests = createRequire(join(root, 'packages/extension-host-worker-tests/package.json'))
const requireBuild = createRequire(join(root, 'packages/build/package.json'))
const { _electron } = requireTests('playwright')
const { expect } = requireTests('@playwright/test')
const { build } = requireBuild('esbuild')
const profile = await mkdtemp(join(tmpdir(), 'lvce-process-explorer-heap-'))
const downloads = join(profile, 'downloads')
await writeFile(join(profile, 'example.txt'), 'process explorer renderer heap snapshot acceptance\n')
const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const bundleUrl = '/packages/renderer-worker/dist/processExplorerRendererHeapSnapshotTestMain.js'
await build({
  entryPoints: [join(root, 'packages/renderer-worker/src/rendererWorkerMain.ts')],
  outfile: join(root, bundleUrl),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  external: ['node:*', '/static/*', 'electron'],
  logLevel: 'error',
})

let app
let processExplorer
try {
  await writeFile(rendererPath, rendererSource.replace('/packages/renderer-worker/src/rendererWorkerMain.ts', bundleUrl))
  const env = { ...process.env, DEV: '1', LVCE_ROOT: root, LVCE_SHARED_PROCESS_PATH: join(root, 'packages/shared-process/src/sharedProcessMain.ts') }
  delete env.ELECTRON_RUN_AS_NODE
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
  app = await _electron.launch({
    executablePath: join(root, 'packages/main-process/node_modules/electron/dist/electron'),
    args: ['--no-sandbox', '--disable-http-cache', '.', profile],
    cwd: join(root, 'packages/main-process'),
    env,
    timeout: 60000,
  })
  await app.evaluate(({ app }, path) => app.setPath('downloads', path), downloads)
  const page = await app.firstWindow()
  page.setDefaultTimeout(15000)
  processExplorer = await (async () => {
    const windowPromise = app.waitForEvent('window')
    await page.keyboard.press('Control+Shift+P')
    const input = page.locator('[name="QuickPickInput"]')
    await input.fill('>Developer: Open Process Explorer')
    await expect(page.getByRole('option', { name: 'Developer: Open Process Explorer', exact: true })).toBeVisible()
    await input.press('Enter')
    return windowPromise
  })()
  processExplorer.setDefaultTimeout(15000)
  await expect(processExplorer.locator('#Workbench')).toBeVisible()
  const processExplorerPid = await app.evaluate(({ BrowserWindow }, url) => {
    const window = BrowserWindow.getAllWindows().find((candidate) => candidate.webContents.getURL() === url)
    if (!window) throw new Error(`Process Explorer window not found: ${url}`)
    return window.webContents.getOSProcessId()
  }, processExplorer.url())
  const row = processExplorer.locator('.ProcessExplorerRow[title*="--type=renderer"]').filter({ hasText: String(processExplorerPid) })
  await expect(row).toBeVisible({ timeout: 60000 })
  // The process explorer window owns this renderer; filtering by its PID avoids selecting the main window renderer.
  await row.click({ button: 'right' })
  const action = processExplorer.getByRole('menuitem', { name: 'Take Heap Snapshot', exact: true })
  await expect(action).toBeVisible()
  await action.click()
  await expect(page.locator('.HeapSnapshotView')).toBeVisible({ timeout: 60000 })
  await expect(page.locator('.HeapSnapshotViewError')).toHaveCount(0)
  await expect(page.locator('.HeapSnapshotTable')).toBeVisible()
  const files = (await readdir(downloads)).filter((name) => name.endsWith('.heapsnapshot'))
  assert.equal(files.length, 1)
  const snapshot = JSON.parse(await readFile(join(downloads, files[0]), 'utf8'))
  assert.ok(snapshot.snapshot.node_count > 0)
  assert.ok(snapshot.nodes.length > 0)
  console.log(`Process Explorer renderer heap snapshot passed: ${join(downloads, files[0])}`)
} finally {
  await processExplorer?.close()
  await app?.close()
  await writeFile(rendererPath, rendererSource)
  await rm(profile, { force: true, recursive: true })
}
