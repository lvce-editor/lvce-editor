import { _electron as electron, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const require = createRequire(join(root, 'packages/main-process/package.json'))
const profile = await mkdtemp(join(tmpdir(), 'lvce-titlebarless-test-'))
const env = {
  ...process.env,
  LVCE_ROOT: root,
  LVCE_SHARED_PROCESS_PATH: join(root, 'packages/shared-process/src/sharedProcessMain.ts'),
  XDG_CONFIG_HOME: join(profile, 'config'),
  XDG_DATA_HOME: join(profile, 'data'),
  XDG_CACHE_HOME: join(profile, 'cache'),
  XDG_STATE_HOME: join(profile, 'state'),
}
let app
const launch = async () => {
  app = await electron.launch({
    executablePath: require('electron'),
    args: ['--no-sandbox', join(root, 'packages/main-process'), `--user-data-dir=${join(profile, 'chromium')}`],
    env,
  })
  app.process().stderr.on('data', (data) => process.stderr.write(data))
  app.on('console', (message) => console.log(message.text()))
  const paths = await app.evaluate(({ app }) => ({ config: process.env.XDG_CONFIG_HOME, data: app.getPath('userData') }))
  assert.equal(paths.config, env.XDG_CONFIG_HOME)
  assert.ok(paths.data.startsWith(profile + '/'), `Unexpected user data path: ${paths.data}`)
  const page = await app.firstWindow()
  page.on('pageerror', (error) => console.error(error))
  page.on('console', (message) => console.log(message.text()))
  page.on('response', (response) => {
    if (response.status() >= 400) console.error(response.status(), response.url())
  })
  console.log('Window URL', page.url())
  await expect(page.locator('.Main')).toBeVisible()
  await expect(page.locator('.ActivityBarItem').first()).toBeVisible()
  return page
}
const command = (page, name, ...args) =>
  page.evaluate(
    async ({ name, args }) => {
      const { executeCommand } = await import(document.querySelector('script[src*="rendererProcessMain"]').src)
      await executeCommand(name, ...args)
    },
    { name, args },
  )
const top = async (page, selector) => (await page.locator(selector).boundingBox()).y
const checkCompact = async (page) => {
  await expect(page.locator('.Workbench')).toHaveClass(/CompactTitleBar/)
  await expect.poll(() => top(page, '.Main')).toBe(0)
  await expect.poll(() => top(page, '.SideBar:not(.SecondarySideBar)')).toBe(29)
  await expect.poll(() => top(page, '.ActivityBar')).toBe(29)
  const bar = await page.locator('.TitleBar').boundingBox()
  const sidebar = await page.locator('.SideBar:not(.SecondarySideBar)').boundingBox()
  const main = await page.locator('.Main').boundingBox()
  assert.ok(bar.x + bar.width <= main.x || bar.x >= main.x + main.width)
  assert.ok(bar.x <= sidebar.x && bar.x + bar.width >= sidebar.x + sidebar.width)
  for (const label of ['Minimize', 'Maximize', 'Close']) {
    const button = page.getByRole('button', { name: label, exact: true })
    await expect(button).toBeVisible()
    await expect(button).toHaveCSS('app-region', 'no-drag')
    const bounds = await button.boundingBox()
    assert.ok(bounds.y + bounds.height <= sidebar.y)
  }
  await expect(page.locator('.TitleBar')).toHaveCSS('app-region', 'drag')
}
try {
  let page = await launch()
  await expect(page.locator('.Workbench')).not.toHaveClass(/TitleBarless/)
  await expect.poll(() => top(page, '.Main')).toBe(29)
  await app.close()
  app = undefined
  const settings = join(env.XDG_CONFIG_HOME, 'lvce-oss/settings.json')
  await mkdir(join(env.XDG_CONFIG_HOME, 'lvce-oss'), { recursive: true })
  // The requested mode must also work when native style / WCO were previously selected.
  await writeFile(
    settings,
    JSON.stringify({ 'window.titleBarless.enabled': true, 'window.titleBarStyle': 'native', 'window.controlsOverlay.enabled': true }),
  )
  page = await launch()
  await checkCompact(page)
  await command(page, 'Layout.showSecondarySideBar')
  await expect(page.locator('.SecondarySideBar')).toBeVisible()
  assert.equal(await top(page, '.SecondarySideBar'), 0)
  await command(page, 'Layout.toggleSideBarPosition')
  await checkCompact(page)
  assert.equal(await top(page, '.SecondarySideBar'), 0)
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setSize(1000, 700))
  await checkCompact(page)
  await command(page, 'Layout.toggleSideBar')
  await expect(page.locator('.Workbench')).not.toHaveClass(/CompactTitleBar/)
  await expect.poll(() => top(page, '.Main')).toBe(29)
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toBeVisible()
  await command(page, 'Layout.toggleSideBar')
  await checkCompact(page)
  await command(page, 'Layout.enterSideBarFocusMode')
  await expect(page.locator('.Main')).toBeHidden()
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toBeVisible()
  await command(page, 'Layout.leaveSideBarFocusMode')
  await checkCompact(page)
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setFullScreen(true))
  await expect(page.locator('.TitleBar')).toBeHidden()
  await expect.poll(() => top(page, '.ActivityBar')).toBe(0)
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setFullScreen(false))
  await checkCompact(page)
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setBounds({ x: 100, y: 100, width: 1000, height: 700 }))
  await checkCompact(page)
  const windowBounds = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].getBounds())
  const dragArea = await page.locator('.TitleBar').boundingBox()
  execFileSync('xdotool', [
    'mousemove',
    '--sync',
    String(windowBounds.x + dragArea.x + 10),
    String(windowBounds.y + 12),
    'sleep',
    '0.2',
    'mousedown',
    '1',
    'sleep',
    '0.1',
    'mousemove_relative',
    '--',
    '10',
    '10',
    'sleep',
    '0.2',
    'mousemove_relative',
    '--',
    '40',
    '30',
    'sleep',
    '0.1',
    'mouseup',
    '1',
  ])
  await expect.poll(() => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].getBounds().x)).not.toBe(windowBounds.x)
  await page.getByRole('button', { name: 'Maximize', exact: true }).click()
  await expect.poll(() => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].isMaximized())).toBe(true)
  await page.getByRole('button', { name: 'Maximize', exact: true }).click()
  await expect.poll(() => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].isMaximized())).toBe(false)
  await page.getByRole('button', { name: 'Minimize', exact: true }).click()
  await expect.poll(() => app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].isMinimized())).toBe(true)
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].restore())
  await page.reload()
  await checkCompact(page)
  await app.close()
  app = undefined
  page = await launch()
  await checkCompact(page)
  const enabledClosed = app.waitForEvent('close')
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  await enabledClosed
  app = undefined
  await writeFile(
    settings,
    JSON.stringify({ 'window.titleBarless.enabled': false, 'window.titleBarStyle': 'custom', 'window.controlsOverlay.enabled': false }),
  )
  page = await launch()
  await expect(page.locator('.Workbench')).not.toHaveClass(/TitleBarless/)
  await expect.poll(() => top(page, '.Main')).toBe(29)
  const closed = app.waitForEvent('close')
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  await closed
  app = undefined
  console.log(
    'Linux titlebarless layout: geometry, both sidebar positions, hidden sidebar, resize, fullscreen, controls, reload, persistence and disabling passed',
  )
} finally {
  await app?.close()
  await rm(profile, { recursive: true, force: true })
}
