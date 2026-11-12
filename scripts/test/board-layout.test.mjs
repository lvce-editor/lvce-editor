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

test('board layout connects Trello, recovers errors and navigates IDE/chat/board', { timeout: 120_000 }, async () => {
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
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    const chatTab = page.getByRole('tab', { name: 'Chat 2', exact: true })
    await expect(chatTab).toBeVisible({ timeout: 60_000 })
    // Establish keyboard focus through an interactive view before sending F1.
    // Activity-bar visibility alone does not establish focus in headless Windows.
    await chatTab.click()
    const initialComposer = page.getByRole('textbox', { name: 'Message', exact: true })
    await initialComposer.focus()
    await expect(initialComposer).toBeFocused()
    let status = 200
    const fixture = {
      id: 'board',
      name: 'Product board',
      lists: [
        { id: 'done', name: 'Done', pos: 2 },
        { id: 'todo', name: 'Todo', pos: 1 },
      ],
      cards: [
        { id: 'second', idList: 'todo', name: 'Second card', pos: 2 },
        { id: 'first', idList: 'todo', name: 'First card', pos: 1 },
      ],
    }
    await page.context().route('https://api.trello.com/**', async (route) => {
      const request = route.request()
      if (request.method() !== 'OPTIONS') {
        assert.ok(!request.url().includes('testtoken'))
        assert.match(request.headers().authorization, /oauth_token="testtoken"/)
      }
      await route.fulfill({
        status: request.method() === 'OPTIONS' ? 204 : status,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-headers': 'authorization',
          'access-control-allow-methods': 'GET, OPTIONS',
        },
        ...(request.method() === 'OPTIONS' ? {} : { json: fixture }),
      })
    })
    const command = async (label) => {
      await page.keyboard.press('F1')
      await page.locator('.QuickPick input').fill(`>${label}`)
      await page.locator('.QuickPickItem').filter({ hasText: label }).click()
    }
    await command('View: Open Board Layout')
    await expect(page.locator('.BoardSetupTitle')).toHaveText('Connect a Trello board')
    await expect(page.locator('.Workbench')).toHaveClass(/AiNativeLayout/)
    await page.getByRole('textbox', { name: 'Board URL or ID', exact: true }).fill('https://trello.com/b/5k8NLHLh/work')
    await page.getByRole('textbox', { name: 'Trello API key', exact: true }).fill('testkey')
    await page.getByRole('textbox', { name: 'Trello read token', exact: true }).fill('testtoken')
    await page.getByRole('button', { name: 'Connect board', exact: true }).click()
    await expect(page.locator('.BoardTitle')).toHaveText('Product board')
    await expect(page.locator('.BoardColumnTitle')).toHaveText(['Todo', 'Done'])
    await expect(page.locator('.BoardCard')).toHaveText(['First card', 'Second card'])
    await expect(page.locator('.BoardEmptyList')).toHaveText('No cards')
    const settings = JSON.parse(await readFile(join(config, 'settings.json'), 'utf8'))
    assert.deepEqual(settings['chat2.connectedBoardIds'], ['5k8NLHLh'])
    assert.ok(!JSON.stringify(settings).includes('testtoken'))
    for (const [failure, code] of [
      [404, 'TRELLO_BOARD_NOT_FOUND'],
      [403, 'TRELLO_ACCESS_DENIED'],
      [500, 'TRELLO_SERVER_ERROR'],
    ]) {
      status = failure
      await page.getByRole('button', { name: 'Refresh board', exact: true }).click()
      await expect(page.locator('.BoardError')).toContainText(code)
      status = 200
      await page.getByRole('button', { name: 'Try again', exact: true }).click()
      await expect(page.locator('.BoardError')).toHaveCount(0)
    }
    for (const width of [560, 1280]) {
      await page.setViewportSize({ width, height: 800 })
      await expect(page.getByRole('button', { name: 'IDE layout', exact: true })).toBeInViewport()
      const bounds = await page.locator('.BoardColumns').boundingBox()
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width)
    }
    await page.getByRole('button', { name: 'IDE layout', exact: true }).click()
    await expect(page.locator('.Workbench')).not.toHaveClass(/AiNativeLayout/)
    const activityBar = page.locator('.ActivityBarLayout')
    await activityBar.dispatchEvent('wheel', { deltaY: -100, bubbles: true })
    await expect(page.locator('.ChatAiNativeLayout')).toBeVisible()
    const composer = page.getByRole('textbox', { name: 'Message', exact: true })
    await composer.fill('Keep this chat draft')
    // Distinct gestures are separated from the trackpad burst debounce window.
    await new Promise((resolve) => setTimeout(resolve, 750))
    await activityBar.dispatchEvent('wheel', { deltaY: -100, bubbles: true })
    await expect(page.locator('.BoardView')).toBeVisible()
    await expect(page.locator('.BoardTitle')).toHaveText('Product board')
    await activityBar.dispatchEvent('wheel', { deltaY: 100, bubbles: true })
    await expect(page.locator('.ChatAiNativeLayout')).toBeVisible()
    await expect(composer).toHaveValue('Keep this chat draft')
    await new Promise((resolve) => setTimeout(resolve, 750))
    await activityBar.dispatchEvent('wheel', { deltaY: 100, bubbles: true })
    await expect(page.locator('.Workbench')).not.toHaveClass(/AiNativeLayout/)
    await command('View: Open Board Layout')
    await page.getByRole('button', { name: 'Disconnect board', exact: true }).click()
    await expect(page.locator('.BoardSetupTitle')).toBeVisible()
    const disconnected = JSON.parse(await readFile(join(config, 'settings.json'), 'utf8'))
    assert.deepEqual(disconnected['chat2.connectedBoardIds'], [])
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
