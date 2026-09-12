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
const profile = await mkdtemp(join(tmpdir(), 'lvce-browser-native-lifecycle-'))
await writeFile(join(profile, 'example.txt'), 'Editor fixture')
await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
await writeFile(
  join(profile, 'config/lvce-oss/keybindings.json'),
  JSON.stringify([{ source: 'User', key: parseKeyBindingString('Ctrl+Alt+1'), command: 'Layout.showPreview', args: ['simple-browser://'] }]),
)
const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const bundleUrl = '/packages/renderer-worker/dist/browserNativeLifecycleTestMain.js'
await build({
  entryPoints: [join(root, 'packages/renderer-worker/src/rendererWorkerMain.ts')],
  outfile: join(root, bundleUrl),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  external: ['node:*', '/static/*', 'electron'],
  logLevel: 'error',
})
const server = createServer((request, response) => {
  response.setHeader('Content-Type', 'text/html')
  response.end(
    `<!doctype html><title>Article ${request.url}</title><style>body{background:rgb(40,94,168)}</style><input value="unsaved draft"><script>window.token=crypto.randomUUID()</script>`,
  )
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
    executablePath:
      process.env.LVCE_TEST_ELECTRON ||
      createRequire(join(root, 'packages/main-process/node_modules/@lvce-editor/main-process/package.json'))('electron'),
    args: ['--no-sandbox', '--user-data-dir=' + join(profile, 'chromium'), '.', profile],
    cwd: join(root, 'packages/main-process'),
    env,
    timeout: 60000,
  }
  app = await _electron.launch(launchOptions)
  await app.evaluate(({ session }) => {
    session.fromPartition('persist:browserView').protocol.handle('https', () => new Response('<title>Example</title>'))
  })
  const page = await app.firstWindow()
  await expect(page.getByRole('tree', { name: 'Files Explorer' })).toBeVisible()
  const originalId = await app.evaluate(({ BrowserWindow }) => {
    const window = BrowserWindow.getAllWindows()[0]
    window.setSize(1100, 800)
    return window.id
  })
  await expect.poll(() => page.evaluate(() => innerWidth)).toBe(1100)
  const otherId = await app.evaluate(({ BrowserWindow }) => {
    const other = new BrowserWindow({ height: 200, show: true, width: 300 })
    other.focus()
    return other.id
  })
  await expect.poll(() => app.evaluate(({ BrowserWindow }) => BrowserWindow.getFocusedWindow()?.id)).toBe(otherId)
  // Send the command to the originating renderer while the other native window has focus.
  await page.keyboard.press('Control+Alt+1')
  const address = page.locator('[name="simple-browser-address"]')
  await expect(address).toBeVisible()
  const ownership = await app.evaluate(
    ({ BrowserWindow }, [originalId, otherId]) => ({
      original: BrowserWindow.fromId(originalId)
        .contentView.children.filter((view) => view.webContents)
        .map((view) => view.webContents.id),
      other: BrowserWindow.fromId(otherId)
        .contentView.children.filter((view) => view.webContents)
        .map((view) => view.webContents.id),
    }),
    [originalId, otherId],
  )
  assert.equal(ownership.original.length, 1, 'The requesting window must own the native tab')
  assert.deepEqual(ownership.other, [], 'The focused unrelated window must not receive the tab')
  await app.evaluate(
    ({ BrowserWindow }, [originalId, otherId]) => {
      BrowserWindow.fromId(otherId).destroy()
      BrowserWindow.fromId(originalId).focus()
    },
    [originalId, otherId],
  )

  const getLiveIds = () =>
    app.evaluate(
      ({ BrowserWindow }, id) =>
        BrowserWindow.fromId(id)
          .contentView.children.filter((view) => view.webContents && view.getVisible())
          .map((view) => view.webContents.id),
      originalId,
    )
  const waitForLiveFrames = async (id) => {
    await expect
      .poll(() => app.evaluate(({ webContents }, id) => webContents.fromId(id).executeJavaScript('document.visibilityState'), id))
      .toBe('visible')
    await app.evaluate(async ({ webContents }, id) => {
      let timer
      try {
        await Promise.race([
          webContents.fromId(id).executeJavaScript('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))'),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error('Visible native page stopped producing frames')), 5000)
          }),
        ])
      } finally {
        clearTimeout(timer)
      }
    }, id)
  }
  for (const path of ['first', 'second']) {
    if (path === 'second') await page.getByRole('button', { name: 'New Tab', exact: true }).click()
    await address.fill(url + '/' + path)
    await address.evaluate((input) => input.form.requestSubmit())
    await expect(page.locator('.SimpleBrowserTabSelected')).toHaveAttribute('aria-label', 'Article /article/' + path)
    await expect.poll(async () => (await getLiveIds()).length).toBe(1)
    const [id] = await getLiveIds()
    await waitForLiveFrames(id)
    const token = await app.evaluate(({ webContents }, id) => webContents.fromId(id).executeJavaScript('window.token'), id)
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.locator('.ActivityBar').click({ button: 'right', position: { x: 15, y: 180 } })
      await expect(page.getByRole('menuitem', { name: 'Hide Activity Bar', exact: true })).toBeVisible()
      await expect(page.locator('.SimpleBrowserSnapshot')).toBeVisible()
      await expect.poll(getLiveIds).toEqual([])
      await page.keyboard.press('Escape')
      await expect(page.locator('.SimpleBrowserSnapshot')).toHaveCount(0)
      await expect.poll(getLiveIds).toEqual([id])
      await waitForLiveFrames(id)
      assert.deepEqual(
        await app.evaluate(
          ({ webContents }, id) => webContents.fromId(id).executeJavaScript('({token:window.token,draft:document.querySelector("input").value})'),
          id,
        ),
        { token, draft: 'unsaved draft' },
      )
    }
  }
  await page.getByRole('tab', { name: 'Article /article/first', exact: true }).click()
  await expect.poll(getLiveIds).toEqual(ownership.original)
  await waitForLiveFrames(ownership.original[0])
  console.log('PASS: originating window owns browser tabs and native frames resume after overlays and tab switches')
} finally {
  await app?.close()
  await writeFile(rendererPath, rendererSource)
  await new Promise((resolveClose) => server.close(resolveClose))
  await rm(profile, { recursive: true, force: true })
}
