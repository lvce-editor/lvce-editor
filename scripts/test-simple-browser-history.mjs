import assert from 'node:assert/strict'
import { parseKeyBindingString } from '../packages/renderer-worker/src/parts/ParseKeyBindingString/ParseKeyBindingString.js'
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
const profile = await mkdtemp(join(tmpdir(), 'lvce-browser-history-'))
await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
await writeFile(
  join(profile, 'config/lvce-oss/keybindings.json'),
  JSON.stringify([{ source: 'User', key: parseKeyBindingString('Ctrl+Alt+1'), command: 'SimpleBrowser.openHistory' }]),
)

const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const bundleUrl = '/packages/renderer-worker/dist/simpleBrowserHistoryTestMain.js'
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
    args: ['--no-sandbox', '--disable-http-cache', '--user-data-dir=' + join(profile, 'chromium'), '.', profile],
    cwd: join(root, 'packages/main-process'),
    env,
    timeout: 60000,
  })
  const page = await app.firstWindow()
  await expect(page.locator('#Workbench')).toBeVisible({ timeout: 30000 })
  await page.evaluate(() => {
    localStorage.setItem(
      'simple-browser-history',
      JSON.stringify([
        { date: Date.UTC(2026, 8, 2, 11, 15), url: 'https://older.example' },
        { date: Date.UTC(2026, 8, 3, 12, 30), url: 'https://newer.example/docs' },
      ]),
    )
  })
  await page.keyboard.press('Control+Alt+1')

  const historyView = page.locator('.SimpleBrowserHistory')
  await expect(historyView).toBeVisible()
  await expect(page.locator('.SimpleBrowserTabSelected')).toHaveAttribute('aria-label', 'History')
  const entries = historyView.locator('.SimpleBrowserHistoryEntry')
  await expect(historyView.locator('.SimpleBrowserHistoryUrl').filter({ hasText: 'https://newer.example/docs' })).toHaveCount(1)
  await expect(historyView.locator('.SimpleBrowserHistoryUrl').filter({ hasText: 'https://older.example' })).toHaveCount(1)
  await historyView.locator('.SimpleBrowserHistorySearchInput').fill('older')
  await expect(entries).toHaveCount(1)
  await entries.locator('.SimpleBrowserHistoryRemove').click()
  await expect(entries).toHaveCount(0)
  await expect(historyView).toContainText('No matching history entries')

  const nativeHistoryUrls = await app.evaluate(({ webContents }) =>
    webContents
      .getAllWebContents()
      .map((contents) => contents.getURL())
      .filter((url) => url.startsWith('simple-browser-history://')),
  )
  assert.deepEqual(nativeHistoryUrls, [])
  await page.locator('.SimpleBrowserTabSelected .SimpleBrowserTabClose').click()
  await expect(historyView).toHaveCount(0)
  console.log('PASS: Simple Browser history opens as an interactive preview tab without an unknown-protocol native page')
} finally {
  await app?.close()
  await writeFile(rendererPath, rendererSource)
  await rm(profile, { recursive: true, force: true })
}
