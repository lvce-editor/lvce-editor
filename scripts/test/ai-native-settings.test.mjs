import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from '@playwright/test'
import { bundleBuiltinSettings } from '../../packages/build/src/parts/BundleBuiltinSettings/BundleBuiltinSettings.ts'

const root = fileURLToPath(new URL('../../', import.meta.url))

test('AI-native settings keep sessions, edit preferences, resize, and return to chat', { timeout: 120_000 }, async () => {
  const profile = await mkdtemp(join(tmpdir(), 'lvce-ai-settings-'))
  let server
  let browser
  let serverLog = ''
  try {
    const config = join(profile, 'config', 'lvce-oss')
    await mkdir(config, { recursive: true })
    await writeFile(join(config, 'settings.json'), JSON.stringify({ 'chat2.useMockBackend': true, 'chat2.experimentalFocusMode': true }))
    const workers = JSON.parse(await readFile(join(root, 'packages/renderer-worker/src/parts/Workers/Workers.json'), 'utf8'))
    await bundleBuiltinSettings({ toRoot: join(root, 'packages/renderer-worker/node_modules'), workers })
    server = spawn(process.execPath, ['packages/server/bin/server.js'], {
      cwd: root,
      env: {
        ...process.env,
        PORT: '0',
        XDG_CONFIG_HOME: join(profile, 'config'),
        XDG_DATA_HOME: join(profile, 'data'),
        XDG_CACHE_HOME: join(profile, 'cache'),
        XDG_STATE_HOME: join(profile, 'state'),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const url = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Server readiness timed out: ${serverLog}`)), 30_000)
      const receive = (chunk) => {
        serverLog += chunk
        const match = serverLog.match(/listening on (http:\/\/localhost:\d+)/)
        if (match) {
          clearTimeout(timer)
          resolve(match[1])
        }
      }
      server.stdout.on('data', receive)
      server.stderr.on('data', receive)
      server.once('exit', (code) => {
        clearTimeout(timer)
        reject(new Error(`Server exited ${code}: ${serverLog}`))
      })
      server.once('error', (error) => {
        clearTimeout(timer)
        reject(error)
      })
    })
    browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN })
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    await page.goto(url)
    await page.getByRole('tab', { name: 'Chat 2', exact: true }).click()
    await page.getByRole('button', { name: 'Focus entirely on chat' }).click()
    await expect(page.locator('.Workbench')).toHaveClass(/AiNativeLayout/)
    const sessions = page.locator('.ChatSessions')
    await expect(sessions).toBeVisible()
    const sessionTitle = await sessions.locator('.ChatTaskButton').first().innerText()
    await sessions.locator('.ChatTaskButton').first().click()
    const composer = page.getByRole('textbox', { name: 'Message', exact: true })
    await composer.fill('Unsent draft')
    const shortcut = process.platform === 'darwin' ? 'Meta+,' : 'Control+,'
    await page.keyboard.press(shortcut)
    const settings = page.locator('.AiNativeSettings')
    const search = page.getByRole('textbox', { name: 'Search Settings' })
    await expect(search).toBeVisible()
    await expect(sessions).toBeVisible()
    await expect(page.locator('.ChatDetailViewAiNative')).toBeHidden()
    await expect(settings).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(search).toHaveCSS('color', 'rgb(32, 33, 36)')
    await page.keyboard.press(shortcut)
    await expect(settings).toHaveCount(1)
    await search.fill('application.scrollspeed')
    const speed = settings.getByRole('spinbutton').first()
    await expect(speed).toBeVisible()
    await speed.fill('2')
    await speed.press('Tab')
    await expect.poll(async () => JSON.parse(await readFile(join(config, 'settings.json'), 'utf8'))['application.scrollspeed']).toBe(2)
    for (const width of [560, 1280]) {
      await page.setViewportSize({ width, height: 800 })
      const close = page.getByRole('button', { name: 'Close Settings' })
      await expect(close).toBeInViewport()
      await expect(sessions).toBeVisible()
      const box = await settings.boundingBox()
      assert.ok(box.width > 0 && box.x >= 0 && box.x + box.width <= width)
    }
    await page.getByRole('button', { name: 'Close Settings' }).click()
    await expect(settings).toHaveCount(0)
    await expect(page.locator('.ChatDetailViewAiNative')).toBeVisible()
    await expect(composer).toHaveValue('Unsent draft')
    await expect(sessions.locator('.ChatTaskButton').first()).toHaveText(sessionTitle)
    await expect(page.locator('.Workbench')).toHaveClass(/AiNativeLayout/)
    await page.keyboard.press(shortcut)
    await expect(search).toBeVisible()
    await search.fill('application.scrollspeed')
    await expect(settings.getByRole('spinbutton').first()).toHaveValue('2')
  } finally {
    await browser?.close()
    if (server && server.exitCode === null) {
      const exited = once(server, 'exit')
      server.kill()
      await exited
    }
    await rm(profile, { recursive: true, force: true })
  }
})
