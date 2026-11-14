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

test('board layout loads from its URL and tracks navigation paths', { timeout: 120_000 }, async () => {
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
    server = spawn(
      process.execPath,
      ['packages/server/bin/server.js', ...(process.env.BOARD_EXTENSION_PATH ? [`--only-extension=${process.env.BOARD_EXTENSION_PATH}`] : [])],
      {
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
      },
    )
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
    const directContext = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const directPage = await directContext.newPage()
    const boardRoute = new URL('/board', url)
    const directResponse = await directPage.goto(boardRoute.href, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    assert.equal(directResponse?.status(), 200)
    await expect(directPage.locator('.BoardView')).toBeVisible({ timeout: 15_000 })
    await expect(directPage.locator('.BoardSetupTitle')).toHaveText('Connect a board')
    await directPage.reload({ waitUntil: 'domcontentloaded' })
    await expect(directPage.locator('.BoardView')).toBeVisible()
    assert.equal(new URL(directPage.url()).pathname, '/board')
    await directContext.close()

    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    const chatTab = page.getByRole('tab', { name: 'Chat 2', exact: true })
    await expect(chatTab).toBeVisible({ timeout: 60_000 })
    await chatTab.click()
    const composer = page.getByRole('textbox', { name: 'Message', exact: true })
    await composer.focus()
    await expect(composer).toBeFocused()
    const command = async (label) => {
      await page.keyboard.press('F1')
      await page.locator('.QuickPick input').fill(`>${label}`)
      await page.locator('.QuickPickItem').filter({ hasText: label }).click()
    }
    const expectPath = (path) => expect.poll(() => new URL(page.url()).pathname).toBe(path)
    await command('View: Open Board Layout')
    await expectPath('/board')
    await expect(page.locator('.BoardSetupTitle')).toHaveText('Connect a board')
    await page.getByRole('button', { name: 'IDE layout', exact: true }).click()
    await expectPath('/')
    const activityBar = page.locator('.ActivityBarLayout')
    await activityBar.dispatchEvent('wheel', { deltaY: -100, bubbles: true })
    await expect(page.locator('.ChatAiNativeLayout')).toBeVisible()
    await expectPath('/chat')
    await new Promise((resolve) => setTimeout(resolve, 750))
    await activityBar.dispatchEvent('wheel', { deltaY: -100, bubbles: true })
    await expect(page.locator('.BoardView')).toBeVisible()
    await expectPath('/board')
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
