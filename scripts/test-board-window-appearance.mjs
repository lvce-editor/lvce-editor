import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { test } from 'node:test'
import { _electron, expect } from '@playwright/test'
import electronPath from 'electron'

const selectLayout = (page, command) =>
  page.evaluate(async (command) => {
    const script = [...document.querySelectorAll('script[type="module"]')].find((node) => node.src.includes('rendererProcessMain'))
    const renderer = await import(script.src)
    await renderer.ready
    await renderer.executeCommand('ExtensionHost.executeCommand', command)
  }, command)

test('native window colors follow the Board layout', { timeout: 180_000 }, async () => {
  const root = resolve('.')
  const profile = await mkdtemp(join(tmpdir(), 'lvce-board-window-'))
  const env = {
    ...process.env,
    DEV: '1',
    LVCE_ROOT: root,
    LVCE_SHARED_PROCESS_PATH: join(root, 'packages/shared-process/src/sharedProcessMain.ts'),
  }
  delete env.ELECTRON_RUN_AS_NODE
  for (const key of ['CONFIG', 'DATA', 'CACHE', 'STATE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
  const settingsDirectory = join(env.XDG_CONFIG_HOME, 'lvce-oss')
  let app
  try {
    const { colors } = JSON.parse(await readFile(join(root, 'extensions/builtin.theme-slime/color-theme.json'), 'utf8'))
    await mkdir(settingsDirectory, { recursive: true })
    await writeFile(
      join(settingsDirectory, 'settings.json'),
      JSON.stringify({ 'window.controlsOverlay.enabled': true, 'window.titleBarStyle': 'custom', 'workbench.colorTheme': 'slime' }),
    )
    app = await _electron.launch({
      executablePath: electronPath,
      args: ['--no-sandbox', `--user-data-dir=${join(profile, 'chromium')}`, join(root, 'packages/main-process')],
      env,
      timeout: 90_000,
    })
    assert.equal(await app.evaluate(() => process.env.XDG_CONFIG_HOME), env.XDG_CONFIG_HOME)
    const page = await app.firstWindow()
    await expect(page.getByRole('tree', { name: 'Files Explorer' })).toBeVisible({ timeout: 90_000 })
    const nativeWindow = await app.browserWindow(page)
    const background = () => nativeWindow.evaluate((window) => window.getBackgroundColor().toLowerCase())
    const overlay = () => nativeWindow.evaluate((window) => window.lastTitleBarOverlay)
    const ideBackground = await background()
    assert.equal(ideBackground, colors.MainBackground)
    await app.evaluate(({ BrowserWindow }) => {
      const setTitleBarOverlay = BrowserWindow.prototype.setTitleBarOverlay
      BrowserWindow.prototype.setTitleBarOverlay = function (options) {
        setTitleBarOverlay.call(this, options)
        this.lastTitleBarOverlay = options
      }
    })

    for (let index = 0; index < 2; index++) {
      await selectLayout(page, 'chat2.showBoardLayout')
      await expect(page.locator('.BoardView')).toBeVisible()
      await expect.poll(background).toBe('#ffffff')
      await expect.poll(overlay).toEqual({ color: '#00000000', symbolColor: '#202124', height: 29 })

      await selectLayout(page, 'chat2.showIdeLayout')
      await expect(page.locator('.BoardView')).toBeHidden()
      await expect.poll(background).toBe(ideBackground)
      await expect.poll(overlay).toEqual({ color: colors.TitleBarBackground, symbolColor: colors.TitleBarColor, height: 29 })
    }
  } finally {
    try {
      await app?.close()
    } finally {
      await rm(profile, { recursive: true, force: true })
    }
  }
})
