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
const profile = await mkdtemp(join(tmpdir(), 'lvce-browser-address-'))
await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
const settingsPath = join(profile, 'config/lvce-oss/settings.json')
await writeFile(settingsPath, JSON.stringify({ 'simpleBrowser.suggestions': true }))
await writeFile(
  join(profile, 'config/lvce-oss/keybindings.json'),
  JSON.stringify([
    { source: 'User', key: parseKeyBindingString('Ctrl+Alt+1'), command: 'Preferences.update', args: [{ 'simpleBrowser.chromeTheme': 'inherit' }] },
    { source: 'User', key: parseKeyBindingString('Ctrl+Alt+2'), command: 'Preferences.update', args: [{ 'simpleBrowser.chromeTheme': 'light' }] },
    { source: 'User', key: parseKeyBindingString('Ctrl+Alt+3'), command: 'Layout.handleSettingsChanged' },
    { source: 'User', key: parseKeyBindingString('Ctrl+Alt+4'), command: 'Layout.toggleSimpleBrowserFullWidth' },
  ]),
)
const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const bundleUrl = '/packages/renderer-worker/dist/browserAddressTestMain.js'
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
  response.end('<!doctype html><title>Local article</title><h1>Local article</h1><script>window.documentToken=crypto.randomUUID()</script>')
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
    args: ['--no-sandbox', '--disable-http-cache', '.', profile],
    cwd: join(root, 'packages/main-process'),
    env,
    timeout: 60000,
  }
  app = await _electron.launch(launchOptions)
  await app.evaluate(({ session, net }) => {
    session.defaultSession.protocol.handle('https', async (request) => {
      if (request.url.startsWith('https://suggestqueries.google.com/')) {
        const query = new URL(request.url).searchParams.get('q')
        return new Response(JSON.stringify([query, [query + ' result']]), { headers: { 'Content-Type': 'application/json' } })
      }
      if (request.url === 'https://example.com/') return new Response('<title>Example Domain</title>', { headers: { 'Content-Type': 'text/html' } })
      return net.fetch(request.url, { bypassCustomProtocolHandlers: true })
    })
  })
  const page = await app.firstWindow()
  page.setDefaultTimeout(15000)
  page.on('console', (message) => {
    if (message.type() === 'error') console.error('APP ERROR', message.text())
  })
  await expect(page.locator('#Workbench')).toBeVisible()
  await expect(page.getByRole('tree', { name: 'Files Explorer' })).toBeVisible()
  await page.evaluate(() => {
    localStorage.setItem('simple-browser-search-history', JSON.stringify(['known first', 'known second', 'offline local']))
    localStorage.setItem('simple-browser-history', JSON.stringify([{ date: Date.now(), url: 'https://known.example/article' }]))
  })
  await page.keyboard.press('Control+Alt+4')
  await expect(page.locator('.BrowserFullWidth')).toBeVisible()
  const address = page.locator('[name="simple-browser-address"]')
  await address.fill(url)
  await address.press('Enter')
  await expect(page.locator('.SimpleBrowserTabSelected')).toHaveAttribute('aria-label', 'Local article')
  const articleToken = () =>
    app.evaluate(async ({ webContents }, url) => {
      const article = webContents.getAllWebContents().find((item) => item.getURL() === url)
      return article?.executeJavaScript('window.documentToken')
    }, url)
  await expect.poll(articleToken).toBeTruthy()
  const token = await articleToken()
  const articleVisible = () =>
    app.evaluate(({ BrowserWindow }, url) => {
      return BrowserWindow.getAllWindows().some((window) =>
        window.contentView.children.some((view) => view.webContents?.getURL() === url && view.getVisible()),
      )
    }, url)
  const snapshot = page.locator('.SimpleBrowserSnapshot')
  const menu = page.locator('#Menu-0')
  await expect.poll(articleVisible).toBe(true)
  await page.locator('.SimpleBrowserTabSelected').click({ button: 'right' })
  await expect(menu).toBeVisible()
  await expect(snapshot).toBeVisible()
  await expect.poll(() => snapshot.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true)
  await expect.poll(articleVisible).toBe(false)
  await page.keyboard.press('Escape')
  await expect(menu).toHaveCount(0)
  await expect(snapshot).toHaveCount(0)
  await expect.poll(articleVisible).toBe(true)
  assert.equal(await articleToken(), token, 'Dismissing the tab menu must restore the same page')
  await page.getByRole('button', { name: 'New Tab', exact: true }).click()
  await expect(address).toHaveValue('')
  const newTabStyles = () =>
    app.evaluate(async ({ webContents }) => {
      const tabs = webContents.getAllWebContents().filter((item) => item.getURL().startsWith('data:text/html'))
      return Promise.all(
        tabs.map((tab) =>
          tab.executeJavaScript(
            '({ background: getComputedStyle(document.documentElement).backgroundColor, foreground: getComputedStyle(document.documentElement).color, scheme: getComputedStyle(document.documentElement).colorScheme, input: getComputedStyle(document.querySelector(".SearchBox")).backgroundColor })',
          ),
        ),
      )
    })
  const lightStyle = { background: 'rgb(255, 255, 255)', foreground: 'rgb(36, 41, 47)', scheme: 'light', input: 'rgb(241, 243, 245)' }
  await expect.poll(newTabStyles).toEqual([lightStyle])
  // A background tab's menu must cover the currently visible new-tab page too.
  await page.getByRole('tab', { name: 'Local article', exact: true }).click({ button: 'right' })
  await expect(menu).toBeVisible()
  await expect(snapshot).toBeVisible()
  await expect.poll(() => snapshot.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true)
  await page.getByRole('menuitem', { name: 'Mute Tab', exact: true }).click()
  await expect(menu).toHaveCount(0)
  await expect(snapshot).toHaveCount(0)
  await expect(address).toHaveValue('')
  assert.equal(await articleToken(), token, 'Tab menu actions must preserve the background page')

  // This matches the middle of a history URL, so there is no inline completion.
  // The resulting single Add patch must append the dropdown, never replace the browser.
  await address.fill('known.example')
  const suggestions = page.locator('.SimpleBrowserSuggestions')
  await expect(suggestions).toBeVisible()
  await expect(address).toBeVisible()
  await expect(address).toBeFocused()
  const addressBounds = await address.boundingBox()
  const suggestionBounds = await suggestions.boundingBox()
  assert(suggestionBounds.y >= addressBounds.y + addressBounds.height, 'Suggestions must stay below the address input')
  await address.evaluate((input) => {
    window.browserAddressInput = input
  })
  await address.click()
  await address.press('End')
  await page.keyboard.type('/article')
  await expect(address).toHaveValue('known.example/article')
  assert.equal(await address.evaluate((input) => input === window.browserAddressInput), true)
  await expect(address).toBeFocused()
  await address.press('Escape')
  await expect(suggestions).toHaveCount(0)

  await address.fill('known')
  await expect(page.locator('.SimpleBrowserInlineSuggestion')).toBeVisible()
  await address.press('End')
  await page.keyboard.type(' query')
  await expect(address).toHaveValue('known query')
  await expect(page.getByRole('option', { name: 'known query result', exact: true })).toBeVisible()
  await expect(address).toHaveValue('known query')
  assert.equal(await address.evaluate((input) => input === window.browserAddressInput), true)
  await address.press('Escape')
  await expect(suggestions).toHaveCount(0)

  // Switching settings updates both the visible and a background new-tab page.
  await page.getByRole('button', { name: 'New Tab', exact: true }).click()
  await expect.poll(newTabStyles).toEqual([lightStyle, lightStyle])
  await address.focus()
  await page.keyboard.press('Control+Alt+1')
  await expect.poll(async () => JSON.parse(await readFile(settingsPath, 'utf8'))['simpleBrowser.chromeTheme']).toBe('inherit')
  await page.keyboard.press('Control+Alt+3')
  await expect(page.locator('.SimpleBrowserLight')).toHaveCount(0)
  await expect.poll(async () => (await newTabStyles()).map((style) => style.scheme)).toEqual(['dark', 'dark'])
  assert((await newTabStyles()).every((style) => style.background !== lightStyle.background))
  await page.keyboard.press('Control+Alt+2')
  await expect.poll(async () => JSON.parse(await readFile(settingsPath, 'utf8'))['simpleBrowser.chromeTheme']).toBe('light')
  await page.keyboard.press('Control+Alt+3')
  await expect(page.locator('.SimpleBrowserLight')).toHaveCount(1)
  await expect.poll(newTabStyles).toEqual([lightStyle, lightStyle])
  assert.equal(await articleToken(), token, 'Theme changes must not reload normal pages')
  await mkdir(join(root, '.tmp/browser-address-evidence'), { recursive: true })
  await address.fill('known.example')
  await expect(suggestions).toBeVisible()
  await page.screenshot({ path: join(root, '.tmp/browser-address-evidence/suggestions.png') })
  console.log('History suggestions preserve the toolbar and typing; visible and background new-tab pages follow the browser theme')
} finally {
  await app?.close()
  await writeFile(rendererPath, rendererSource)
  await new Promise((resolveClose) => server.close(resolveClose))
  await rm(profile, { recursive: true, force: true })
}
