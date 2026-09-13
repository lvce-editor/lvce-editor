import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdtemp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requireTests = createRequire(join(root, 'packages/extension-host-worker-tests/package.json'))
const requireBuild = createRequire(join(root, 'packages/build/package.json'))
const { _electron } = requireTests('playwright')
const { expect } = requireTests('@playwright/test')
const { build } = requireBuild('esbuild')
const profile = await mkdtemp(join(tmpdir(), 'lvce-component-heap-'))
const downloads = join(profile, 'downloads')
await mkdir(downloads)
await writeFile(join(profile, 'example.txt'), 'component heap snapshot acceptance\n')
const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const bundleUrl = '/packages/renderer-worker/dist/componentHeapSnapshotTestMain.js'
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
  page.on('console', (message) => {
    if (message.type() === 'error') console.error('APP ERROR', message.text())
  })
  await expect(page.locator('#Workbench')).toBeVisible()
  await expect(page.getByRole('treeitem', { name: 'example.txt', exact: true })).toBeVisible()
  await page.keyboard.press('Control+Shift+P')
  const input = page.locator('[name="QuickPickInput"]')
  await input.fill('>Developer: Open Component State')
  await expect(page.getByRole('option', { name: 'Developer: Open Component State', exact: true })).toBeVisible()
  await input.press('Enter')
  const card = page.locator('.ComponentStateCard').filter({ has: page.locator('.ComponentStateCardTitle', { hasText: /^Explorer$/ }) })
  await expect(card).toBeVisible()
  await card.click({ button: 'right' })
  const action = page.getByRole('menuitem', { name: 'Show Heap Snapshot', exact: true })
  await expect(action).toBeEnabled()
  await action.click()
  await expect(page.locator('.HeapSnapshotView')).toBeVisible({ timeout: 60000 })
  await expect(page.locator('.HeapSnapshotViewError')).toHaveCount(0)
  await expect(page.locator('.HeapSnapshotTable')).toBeVisible()
  const files = (await readdir(downloads)).filter((name) => name.endsWith('.heapsnapshot'))
  assert.equal(files.length, 1)
  assert.match(files[0], /^Explorer-Worker-/)
  const snapshot = JSON.parse(await readFile(join(downloads, files[0]), 'utf8'))
  assert.ok(snapshot.snapshot.node_count > 0)
  assert.ok(snapshot.nodes.length > 0)
  console.log(`Component heap snapshot passed: ${join(downloads, files[0])}`)
} finally {
  await app?.close()
  await writeFile(rendererPath, rendererSource)
}
