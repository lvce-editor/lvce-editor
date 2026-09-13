import assert from 'node:assert/strict'
import { parseKeyBindingString } from '../packages/renderer-worker/src/parts/ParseKeyBindingString/ParseKeyBindingString.js'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requireTests = createRequire(join(root, 'packages/extension-host-worker-tests/package.json'))
const requireBuild = createRequire(join(root, 'packages/build/package.json'))
const { _electron } = requireTests('playwright')
const { expect } = requireTests('@playwright/test')
const { build } = requireBuild('esbuild')
const profile = await mkdtemp(join(tmpdir(), 'lvce-browser-restore-'))
await writeFile(join(profile, 'example.txt'), 'Editor fixture')
await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
await writeFile(
  join(profile, 'config/lvce-oss/keybindings.json'),
  JSON.stringify([
    { source: 'User', key: parseKeyBindingString('Ctrl+Alt+1'), command: 'Main.openUri', args: ['simple-browser://'] },
    { source: 'User', key: parseKeyBindingString('Ctrl+Alt+2'), command: 'SaveState.handleVisibilityChange', args: ['hidden'] },
  ]),
)
const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const bundleUrl = '/packages/renderer-worker/dist/browserRestoreTestMain.js'
await build({
  entryPoints: [join(root, 'packages/renderer-worker/src/rendererWorkerMain.ts')],
  outfile: join(root, bundleUrl),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  external: ['node:*', '/static/*', 'electron'],
  logLevel: 'error',
})
const server = createServer((_request, response) => {
  response.setHeader('Content-Type', 'text/html')
  response.end('<!doctype html><title>Restored article</title><h1>Restored article</h1>')
})
await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))
const url = `http://127.0.0.1:${server.address().port}/article`
let app
try {
  await writeFile(rendererPath, rendererSource.replace('/packages/renderer-worker/src/rendererWorkerMain.ts', bundleUrl))
  const env = { ...process.env, DEV: '1', LVCE_ROOT: root, LVCE_SHARED_PROCESS_PATH: join(root, 'packages/shared-process/src/sharedProcessMain.ts') }
  delete env.ELECTRON_RUN_AS_NODE
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
  const launchOptions = {
    executablePath: join(root, 'packages/main-process/node_modules/electron/dist/electron'),
    args: ['--no-sandbox', '--user-data-dir=' + join(profile, 'chromium'), '.', profile],
    cwd: join(root, 'packages/main-process'),
    env,
    timeout: 60000,
  }
  app = await _electron.launch(launchOptions)
  await app.evaluate(({ session }) => {
    session.fromPartition('persist:browserView').protocol.handle('https', () => new Response('<title>Example</title>'))
  })
  let page = await app.firstWindow()
  await expect(page.getByRole('tree', { name: 'Files Explorer' })).toBeVisible()
  await page.keyboard.press('Control+Alt+1')
  let address = page.locator('[name="simple-browser-address"]')
  await expect(address).toBeVisible()
  await address.fill(url)
  await address.evaluate((input) => input.form.requestSubmit())
  await expect(page.locator('.SimpleBrowserTabSelected')).toHaveAttribute('aria-label', 'Restored article')
  const getNativePage = () =>
    app.evaluate(({ BrowserWindow }) => {
      const child = BrowserWindow.getAllWindows()[0].contentView.children.find((view) => view.webContents)
      return child && { id: child.webContents.id, url: child.webContents.getURL() }
    })
  const before = await getNativePage()
  assert.equal(before.url, url)
  await page.keyboard.press('Control+Alt+2')
  await expect.poll(() => page.evaluate(() => Object.values(localStorage).some((value) => value.includes('selectedTabIndex')))).toBe(true)
  await app.close()

  app = await _electron.launch(launchOptions)
  page = await app.firstWindow()
  address = page.locator('[name="simple-browser-address"]')
  await expect(address).toHaveValue(url)
  // Restarting Electron reuses the ID. Restored metadata must not substitute for loading the native page.
  await expect.poll(async () => (await getNativePage())?.id).toBe(before.id)
  await expect.poll(async () => (await getNativePage())?.url).toBe(url)
  const heading = await app.evaluate(
    async ({ webContents }, id) => webContents.fromId(id).executeJavaScript('document.querySelector("h1").textContent'),
    before.id,
  )
  assert.equal(heading, 'Restored article')
  console.log('PASS: app restart navigates the new native view even when its ID is reused')
} finally {
  await app?.close()
  await writeFile(rendererPath, rendererSource)
  await new Promise((resolveClose) => server.close(resolveClose))
  await rm(profile, { recursive: true, force: true })
}
