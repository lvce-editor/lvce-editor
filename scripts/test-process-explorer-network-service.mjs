import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseKeyBindingString } from '../packages/renderer-worker/src/parts/ParseKeyBindingString/ParseKeyBindingString.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requireTests = createRequire(join(root, 'packages/extension-host-worker-tests/package.json'))
const { _electron } = requireTests('playwright')
const { expect } = requireTests('@playwright/test')
const profile = await mkdtemp(join(tmpdir(), 'lvce-network-service-'))
let app
try {
  await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
  await writeFile(
    join(profile, 'config/lvce-oss/keybindings.json'),
    JSON.stringify([{ source: 'User', key: parseKeyBindingString('Ctrl+Alt+1'), command: 'Developer.openProcessExplorer' }]),
  )
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
  await expect(page.locator('#Workbench')).toBeVisible()
  await expect(page.getByRole('tree', { name: 'Files Explorer' })).toBeVisible()
  await page.keyboard.press('Control+Alt+1')
  await expect(page.locator('.ProcessExplorerTable')).toBeVisible()
  const networkRow = page
    .locator('.ProcessExplorerRow')
    .filter({ has: page.locator('.ProcessExplorerNameCell', { hasText: /^utility-network-service$/ }) })
  await expect(networkRow).toHaveCount(1)
  const cells = networkRow.locator('.ProcessExplorerCell')
  const pid = Number(await cells.nth(1).textContent())
  assert.ok(pid > 0)
  const cmd = await readFile(`/proc/${pid}/cmdline`, 'utf8')
  assert.match(cmd, /(?:^|[\s\0])--utility-sub-type=network\.mojom\.NetworkService(?:[\s\0]|$)/)
  await expect(cells.nth(2)).not.toHaveText('')
  await expect(page.locator('.ProcessExplorerNameCell', { hasText: /^main$/ })).toBeVisible()
  const renderer = page.workers().find((worker) => worker.url().includes('rendererWorkerMain'))
  assert.ok(renderer, 'Expected the renderer worker')
  await renderer.evaluate(async () => {
    const Command = await import('./parts/Command/Command.js')
    await Command.execute('ProcessExplorer.refresh')
  })
  await expect(networkRow).toHaveCount(1)
  await expect(cells.nth(1)).toHaveText(String(pid))
  await expect(page.locator('.ProcessExplorerError')).toBeHidden()
  if (process.env.PROCESS_EXPLORER_SCREENSHOT) await page.screenshot({ path: process.env.PROCESS_EXPLORER_SCREENSHOT })
  console.log(`Electron NetworkService PID ${pid} displays utility-network-service before and after refresh`)
} finally {
  await app?.close()
  await rm(profile, { recursive: true, force: true })
}
