import assert from 'node:assert/strict'
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
const profile = await mkdtemp(join(tmpdir(), 'lvce-open-remote-'))
await writeFile(join(profile, 'example.txt'), 'Editor fixture')
const { execFileSync } = await import('node:child_process')
execFileSync('git', ['init', profile])
execFileSync('git', ['-C', profile, 'remote', 'add', 'origin', 'git@github.com:owner/repo.git'])
const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const bundleUrl = '/packages/renderer-worker/dist/openRemoteTestMain.js'
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
const url = `http://127.0.0.1:${server.address().port}/owner/repo`
await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
await writeFile(
  join(profile, 'config/lvce-oss/settings.json'),
  JSON.stringify({
    'git.remoteHosts': { 'github.com': `http://127.0.0.1:${server.address().port}` },
  }),
)
let app
try {
  await writeFile(rendererPath, rendererSource.replace('/packages/renderer-worker/src/rendererWorkerMain.ts', bundleUrl))
  const env = { ...process.env, DEV: '1', LVCE_ROOT: root, LVCE_SHARED_PROCESS_PATH: join(root, 'packages/shared-process/src/sharedProcessMain.ts') }
  delete env.ELECTRON_RUN_AS_NODE
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
  app = await _electron.launch({
    executablePath: join(root, 'packages/main-process/node_modules/electron/dist/electron'),
    args: ['--no-sandbox', `--user-data-dir=${join(profile, 'chromium')}`, '.', profile],
    cwd: join(root, 'packages/main-process'),
    env,
    timeout: 60000,
  })
  const childEnv = await app.evaluate(() =>
    Object.fromEntries(['CONFIG', 'DATA', 'STATE', 'CACHE'].map((key) => [key, process.env[`XDG_${key}_HOME`]])),
  )
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) assert.equal(childEnv[key], join(profile, key.toLowerCase()))
  const page = await app.firstWindow()
  page.setDefaultTimeout(15000)
  page.on('pageerror', (error) => console.error(error))
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(message.text())
  })
  await expect(page.locator('#Workbench')).toBeVisible()
  const explorer = page.getByRole('tree', { name: 'Files Explorer' })
  await expect(explorer).toBeVisible()
  await page.getByRole('treeitem', { name: 'cache', exact: true }).click()
  await page.keyboard.press('.')
  const address = page.locator('[name="simple-browser-address"]')
  await expect(address).toHaveValue(url)
  const token = () =>
    app.evaluate(async ({ webContents }, url) => {
      const target = webContents.getAllWebContents().find((item) => item.getURL() === url)
      return target?.executeJavaScript('document.querySelector("h1")?.textContent === "Local article" && window.documentToken')
    }, url)
  await expect.poll(token).toBeTruthy()
  const originalToken = await token()
  const count = await page.locator('.SimpleBrowser').getByRole('tab').count()
  const command = async (label) => {
    await page.keyboard.press('Control+Shift+P')
    const input = page.locator('.QuickPick input')
    await input.fill('>' + label)
    await page.getByRole('option', { name: label, exact: true }).click()
    await expect(input).not.toBeVisible()
  }
  await command('Git: Open Remote in Simple Browser')
  await expect(address).toHaveValue(url)
  await expect(page.locator('.SimpleBrowser').getByRole('tab')).toHaveCount(count)
  assert.equal(await token(), originalToken)
  // Typing a period in the address field must not invoke the workspace shortcut.
  await address.click()
  await expect(address).toBeFocused()
  await address.press('Control+A')
  await address.press('.')
  await expect(address).toHaveValue('.')
  await address.press('Escape')
  await command('Layout: Hide Preview')
  await expect(page.locator('.SimpleBrowser')).not.toBeVisible()
  await page.getByRole('treeitem', { name: 'cache', exact: true }).click()
  await page.keyboard.press('.')
  await expect(address).toHaveValue(url)
  await expect.poll(token).toBeTruthy()
  console.log('Git remote shortcut opens the mapped local page, reuses its tab, preserves text input, and restores hidden preview')
} finally {
  await app?.close()
  await writeFile(rendererPath, rendererSource)
  await new Promise((resolveClose) => server.close(resolveClose))
  await rm(profile, { recursive: true, force: true })
}
