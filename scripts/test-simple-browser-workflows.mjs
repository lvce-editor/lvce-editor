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
const profile = await mkdtemp(join(tmpdir(), 'lvce-browser-workflows-'))
const server = createServer((_request, response) => {
  response.setHeader('Content-Type', 'text/html')
  response.end(
    '<!doctype html><title>Workflow fixture</title><link rel="icon" href="data:,"><h1>Workflow fixture</h1><script>window.keys=[];addEventListener("keydown",e=>keys.push({key:e.key,shift:e.shiftKey,trusted:e.isTrusted}))</script>',
  )
})
await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))
const url = `http://127.0.0.1:${server.address().port}/workflow`
await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
await writeFile(
  join(profile, 'config/lvce-oss/settings.json'),
  JSON.stringify({
    'simpleBrowser.workflows': [
      {
        id: 'fixture',
        tasks: [
          { type: 'open-simple-browser-tab', url },
          { type: 'press-key', key: 'space' },
          { type: 'press-key', key: 'shift+L' },
          { type: 'open-simple-browser-tab', url: `${url}/second` },
          { type: 'press-key', key: 'enter' },
        ],
      },
    ],
  }),
)
await writeFile(
  join(profile, 'config/lvce-oss/keybindings.json'),
  JSON.stringify([{ key: 'ctrl+shift+s', command: 'SimpleBrowser.executeWorkflow', args: ['fixture'] }]),
)
const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const bundleUrl = '/packages/renderer-worker/dist/browserWorkflowTestMain.js'
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
  await app.evaluate(({ session, net }) => {
    session.defaultSession.protocol.handle('https', (request) => {
      if (request.url === 'https://example.com/') {
        return new Response('<title>Example Domain</title>', { headers: { 'Content-Type': 'text/html' } })
      }
      return net.fetch(request.url, { bypassCustomProtocolHandlers: true })
    })
  })
  const page = await app.firstWindow()
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(message.text())
  })
  await expect(page.locator('#Workbench')).toBeVisible({ timeout: 30000 })
  await page.keyboard.press('Control+Shift+s')
  const getKeys = (targetUrl = url) =>
    app.evaluate(async ({ webContents }, url) => {
      const guest = webContents.getAllWebContents().find((item) => item.getURL() === url)
      return guest ? guest.executeJavaScript('window.keys') : undefined
    }, targetUrl)
  await expect.poll(getKeys, { timeout: 30000 }).toEqual([
    { key: ' ', shift: false, trusted: true },
    { key: 'L', shift: true, trusted: true },
  ])
  await expect.poll(() => getKeys(`${url}/second`), { timeout: 30000 }).toEqual([{ key: 'Enter', shift: false, trusted: true }])
  await expect(page.locator('.SimpleBrowserTabSelected')).toHaveAttribute('aria-label', 'Workflow fixture')
  const header = page.locator('.SimpleBrowserHeader')
  await expect(header.locator(':scope > button')).toHaveCount(0)
  await expect(header.locator(':scope > div.SimpleBrowserButtonsLeft > button')).toHaveCount(3)
  await expect(header.locator(':scope > div.SimpleBrowserButtonsRight > button')).toHaveCount(3)
  for (const title of ['Back', 'Forward', 'Reload']) {
    await expect(header.locator('.SimpleBrowserButtonsLeft').getByRole('button', { name: title, exact: true })).toBeVisible()
  }
  await expect(header.locator('.SimpleBrowserButtonsRight .SimpleBrowserMenuButton')).toBeVisible()
  console.log('Workflow shortcut opened a browser and delivered sequential trusted Space and Shift+L events')
} finally {
  await app?.close()
  await writeFile(rendererPath, rendererSource)
  await new Promise((resolveClose) => server.close(resolveClose))
  await rm(profile, { recursive: true, force: true })
}
