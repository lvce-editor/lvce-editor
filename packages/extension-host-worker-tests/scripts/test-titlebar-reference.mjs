import { _electron as electron, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const executablePath = process.env.LVCE_TEST_EXECUTABLE || join(root, 'packages/build/.tmp/linux/deb/amd64/app/usr/lib/lvce-oss/lvce-oss')
const profile = await mkdtemp(join(tmpdir(), 'lvce-titlebar-reference-'))
const env = {
  ...process.env,
  XDG_CONFIG_HOME: join(profile, 'config'),
  XDG_DATA_HOME: join(profile, 'data'),
  XDG_CACHE_HOME: join(profile, 'cache'),
  XDG_STATE_HOME: join(profile, 'state'),
}
const command = (page, name, ...args) =>
  page.evaluate(
    async ({ name, args }) => {
      const { executeCommand } = await import(document.querySelector('script[src*="rendererProcessMain"]').src)
      await executeCommand(name, ...args)
    },
    { name, args },
  )
const checkTitleBar = async (page) => {
  await expect(page.locator('.TitleBarTopLevelEntry').first()).toBeVisible()
  assert.ok(!(await page.locator('body').innerText()).includes('Reference node not found'))
  const fileMenu = page.locator('.TitleBarTopLevelEntry').filter({ hasText: /^File$/ })
  await fileMenu.click()
  await expect(page.locator('.Menu').first()).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.Menu')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toBeVisible()
}
let app
try {
  // Cover local builds and official packages without touching either real profile.
  for (const application of ['lvce-oss', 'lvce']) {
    const config = join(env.XDG_CONFIG_HOME, application)
    await mkdir(config, { recursive: true })
    await writeFile(join(config, 'settings.json'), JSON.stringify({ 'window.titleBarStyle': 'custom', 'window.controlsOverlay.enabled': false }))
  }
  app = await electron.launch({ executablePath, args: ['--no-sandbox', `--user-data-dir=${join(profile, 'chromium')}`], env })
  const paths = await app.evaluate(({ app }) => ({ config: process.env.XDG_CONFIG_HOME, data: app.getPath('userData') }))
  assert.equal(paths.config, env.XDG_CONFIG_HOME)
  assert.ok(paths.data.startsWith(profile + '/'))
  const page = await app.firstWindow()
  await expect(page.locator('.Main')).toBeVisible()
  await checkTitleBar(page)
  for (let iteration = 0; iteration < 3; iteration++) {
    await command(page, 'Layout.toggleSimpleBrowserFullWidth')
    await expect(page.locator('.Workbench')).toHaveClass(/BrowserFullWidth/)
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setFullScreen(true))
    await expect(page.locator('.TitleBar')).toBeHidden()
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setFullScreen(false))
    await expect(page.locator('.Main')).toBeVisible()
    await checkTitleBar(page)
    await page.getByRole('button', { name: 'Maximize', exact: true }).click()
    await expect.poll(() => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].isMaximized())).toBe(true)
    await page.getByRole('button', { name: 'Maximize', exact: true }).click()
    await expect.poll(() => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].isMaximized())).toBe(false)
  }
  await page.reload()
  await checkTitleBar(page)
  console.log('Title bar survives repeated expanded-browser fullscreen transitions, menus, window controls and reload')
} finally {
  await app?.close()
  await rm(profile, { recursive: true, force: true })
}
