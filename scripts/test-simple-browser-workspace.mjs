import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requireTests = createRequire(join(root, 'packages/extension-host-worker-tests/package.json'))
const requireBuild = createRequire(join(root, 'packages/build/package.json'))
const { _electron } = requireTests('playwright')
const { expect } = requireTests('@playwright/test')
const { build } = requireBuild('esbuild')
const profile = await mkdtemp(join(tmpdir(), 'lvce-browser-workspace-'))
const editorFile = join(profile, 'example.txt')
await writeFile(editorFile, 'keep editor selection\nsecond line\n')
const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const bundleUrl = '/packages/renderer-worker/dist/browserWorkspaceTestMain.js'
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
  response.end(
    `<!doctype html><title>Workspace article</title><main style="max-width:640px;margin:auto"><h1>Workspace article</h1><input id="draft"><a href="/second" target="_blank">Second article</a><button id="play" onclick="window.audioContext=new AudioContext();let o=audioContext.createOscillator();let g=audioContext.createGain();g.gain.value=0.001;o.connect(g).connect(audioContext.destination);o.start()">Play audio</button><div style="height:3000px">Article text</div></main><script>window.documentToken=crypto.randomUUID()</script>`,
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
  app = await _electron.launch({
    executablePath: join(root, 'packages/main-process/node_modules/electron/dist/electron'),
    args: ['--no-sandbox', '--disable-http-cache', '.', profile],
    cwd: join(root, 'packages/main-process'),
    env,
    timeout: 60000,
  })
  const page = await app.firstWindow()
  page.setDefaultTimeout(15000)
  await expect(page.locator('#Workbench')).toBeVisible()
  const runCommand = async (label) => {
    await page.keyboard.press('Control+Shift+P')
    const input = page.locator('[name="QuickPickInput"]')
    await expect(input).toBeVisible()
    await input.fill(`>${label}`)
    await expect(page.getByRole('option', { name: label, exact: true })).toBeVisible()
    await input.press('Enter')
  }
  await page.getByRole('treeitem', { name: 'example.txt', exact: true }).dblclick()
  await expect(page.locator('[name="editor"]')).toBeAttached()
  await page.locator('[name="editor"]').focus()
  await runCommand('Simple Browser: Toggle Full Width')
  await expect(page.locator('.BrowserFullWidth')).toBeVisible()
  const address = page.locator('[name="simple-browser-address"]')
  await address.fill(url)
  await address.press('Enter')
  const guestSnapshot = () =>
    app.evaluate(async ({ webContents }, urlPrefix) => {
      const contents = webContents.getAllWebContents().find((item) => item.getURL().startsWith(urlPrefix))
      if (!contents) return undefined
      return {
        id: contents.id,
        data: await contents.executeJavaScript(
          '({ token: documentToken, draft: document.querySelector("#draft").value, scroll: scrollY, audio: window.audioContext?.state })',
        ),
      }
    }, url)
  await expect.poll(guestSnapshot).toBeTruthy()
  await app.evaluate(async ({ webContents }, urlPrefix) => {
    const guest = webContents.getAllWebContents().find((item) => item.getURL().startsWith(urlPrefix))
    await guest.executeJavaScript(
      'document.querySelector("#draft").value="keep this draft";document.querySelector("#play").click();scrollTo(0,300)',
      true,
    )
  }, url)
  const before = await guestSnapshot()
  const button = page.locator('.SimpleBrowserFullWidthButton')
  const timings = []
  for (let index = 0; index < 50; index++) {
    const start = performance.now()
    await button.click()
    await expect(page.locator('.BrowserFullWidth')).toHaveCount(index % 2 === 0 ? 0 : 1)
    timings.push(performance.now() - start)
  }
  assert.deepEqual(await guestSnapshot(), before)
  const dimensions = await page.locator('.SimpleBrowser').boundingBox()
  assert.equal(dimensions.x, 0)
  assert.equal(dimensions.width, await page.evaluate(() => innerWidth))
  const doubleControl = async (guestFocused, targetUrl = url, measure = false) =>
    app.evaluate(
      ({ BrowserWindow, webContents }, { guestFocused, url, measure }) => {
        const window = BrowserWindow.getAllWindows()[0]
        window.focus()
        const target = guestFocused ? webContents.getAllWebContents().find((item) => item.getURL().startsWith(url)) : window.webContents
        target.focus()
        const settled = measure
          ? new Promise((resolve, reject) => {
              const start = Date.now()
              const timer = setInterval(() => {
                const views = window.contentView.children.filter(
                  (view) => 'webContents' in view && view.webContents.getURL().startsWith('http://127.0.0.1:'),
                )
                if (views.length === 1 && views[0].webContents === target && views[0].getBounds().x === 0 && target.isFocused()) {
                  clearInterval(timer)
                  resolve(Date.now() - start)
                } else if (Date.now() - start > 2000) {
                  clearInterval(timer)
                  reject(new Error('Browser bounds and focus did not settle'))
                }
              }, 1)
            })
          : undefined
        for (const type of ['keyDown', 'keyUp', 'keyDown', 'keyUp']) target.sendInputEvent({ type, keyCode: 'Control' })
        return settled
      },
      { guestFocused, url: targetUrl, measure },
    )
  await doubleControl(true)
  await expect(page.locator('.BrowserFullWidth')).toHaveCount(0)
  await expect(page.locator('[name="editor"]')).toBeFocused()
  await doubleControl(false)
  await expect(page.locator('.BrowserFullWidth')).toHaveCount(1)
  await button.click()
  await expect(page.locator('[name="editor"]')).toBeFocused()
  await address.focus()
  await address.evaluate((input) => input.setSelectionRange(2, 8))
  await doubleControl(false)
  await expect(page.locator('.BrowserFullWidth')).toHaveCount(1)
  await expect(address).toBeFocused()
  await expect.poll(() => address.evaluate((input) => [input.selectionStart, input.selectionEnd])).toEqual([2, 8])
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setSize(1100, 800))
  await expect.poll(async () => (await page.locator('.SimpleBrowser').boundingBox()).width).toBe(1100)
  await button.click()
  await expect(page.locator('.BrowserFullWidth')).toHaveCount(0)
  assert.equal((await guestSnapshot()).id, before.id)
  const evidence = join(root, '.tmp/browser-workspace-evidence')
  await mkdir(evidence, { recursive: true })
  await page.screenshot({ path: join(evidence, 'split.png') })
  await button.click()
  await page.screenshot({ path: join(evidence, 'full-width.png') })
  await runCommand('Layout: Toggle Panel')
  await expect(page.locator('.BrowserFullWidth')).toHaveCount(0)
  await runCommand('Simple Browser: Open')
  await expect(page.locator('.SimpleBrowser')).toHaveCount(2)
  const mainBrowser = page.locator('.Main .SimpleBrowser')
  await mainBrowser.locator('.SimpleBrowserFullWidthButton').click()
  await expect(page.locator('.BrowserFullWidth')).toHaveCount(1)
  await page.locator('.SimpleBrowserFullWidthButton').click()
  await expect(page.locator('.SimpleBrowser')).toHaveCount(2)
  const mainUrl = `${url}?main`
  const mainAddress = mainBrowser.locator('[name="simple-browser-address"]')
  await mainAddress.fill(mainUrl)
  await mainAddress.press('Enter')
  await expect
    .poll(() => app.evaluate(({ webContents }, targetUrl) => webContents.getAllWebContents().some((item) => item.getURL() === targetUrl), mainUrl))
    .toBe(true)
  const nativePages = () =>
    app.evaluate(({ BrowserWindow }) => {
      const window = BrowserWindow.getAllWindows()[0]
      return window.contentView.children.flatMap((view) =>
        'webContents' in view && view.webContents.getURL().startsWith('http://127.0.0.1:') ? [view.webContents.getURL()] : [],
      )
    })
  await expect.poll(nativePages).toHaveLength(2)
  const started = Date.now()
  const nativeGestureFocusMs = await doubleControl(true, mainUrl, true)
  await expect(page.locator('.BrowserFullWidth')).toHaveCount(1)
  await expect(page.locator('[name="simple-browser-address"]')).toHaveValue(mainUrl)
  await expect.poll(nativePages).toEqual([mainUrl])
  const nativeGestureRoundTripMs = Date.now() - started
  await page.locator('.SimpleBrowserFullWidthButton').click()
  await expect(page.locator('.SimpleBrowser')).toHaveCount(2)
  await expect.poll(nativePages).toHaveLength(2)
  await page.locator('.PreviewArea .SimpleBrowserFullWidthButton').click()
  await expect(page.locator('.BrowserFullWidth')).toHaveCount(1)
  await expect.poll(nativePages).toEqual([url])
  await page.locator('.SimpleBrowserFullWidthButton').click()
  await expect.poll(nativePages).toHaveLength(2)
  console.log(
    JSON.stringify({
      switches: 50,
      preserved: before.data,
      nativeGestureRoundTripMs,
      nativeGestureFocusMs,
      maximumAutomationRoundTripMs: Math.max(...timings),
      profile,
    }),
  )
} finally {
  await app?.close()
  await writeFile(rendererPath, rendererSource)
  await new Promise((resolveClose) => server.close(resolveClose))
}
