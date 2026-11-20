import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from '@playwright/test'
import { testLayoutTransition } from '../../packages/build/src/parts/TestBoardWorkerIntegration/test-layout-transition.ts'
import { bundleBuiltinSettings } from '../../packages/build/src/parts/BundleBuiltinSettings/BundleBuiltinSettings.ts'

const root = fileURLToPath(new URL('../../', import.meta.url))

const executeCommand = async (page, label) => {
  await page.keyboard.press('F1')
  await page.locator('.QuickPick input').fill(`>${label}`)
  await page.locator('.QuickPickItem').filter({ hasText: label }).click()
}

const withWorkbench = async (settings, run) => {
  const profile = await mkdtemp(join(tmpdir(), 'lvce-ai-settings-'))
  let server
  let browser
  let serverLog = ''
  try {
    const config = join(profile, 'config', 'lvce-oss')
    await mkdir(config, { recursive: true })
    await writeFile(join(config, 'settings.json'), JSON.stringify(settings))
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
    await run(browser, url)
  } finally {
    await browser?.close()
    if (server && server.exitCode === null) {
      const exited = once(server, 'exit')
      server.kill()
      await exited
    }
    await rm(profile, { recursive: true, force: true })
  }
}

test('board layout loads independently and tracks navigation paths', { timeout: 180_000 }, async () => {
  const boardManifest = JSON.parse(await readFile(join(root, 'extensions/builtin.board-view/extension.json'), 'utf8'))
  const chatManifest = JSON.parse(await readFile(join(root, 'extensions/builtin.chat-view-2/extension.json'), 'utf8'))
  assert.equal(boardManifest.isolated, true)
  assert.equal(boardManifest.browser, 'dist/boardWorkerMain.js')
  assert.ok(boardManifest.views.some((view) => view.id === 'chat2.views.board'))
  assert.ok(!chatManifest.views.some((view) => view.id === 'chat2.views.board'))
  await withWorkbench({ 'chat2.useMockBackend': true, 'chat2.experimentalFocusMode': true }, async (browser, url) => {
    for (const route of ['/board', '/board/', '/boards', '/boards/']) {
      const context = await browser.newContext()
      try {
        const page = await context.newPage()
        await page.goto(new URL(route, url).href)
        await expect(page.locator('.BoardView')).toBeVisible()
        await page.reload()
        await expect(page.locator('.BoardView')).toBeVisible()
      } finally {
        await context.close()
      }
    }
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
    const historyPage = await directContext.newPage()
    await historyPage.goto(boardRoute.href, { waitUntil: 'domcontentloaded' })
    await expect(historyPage.locator('.BoardView')).toBeVisible()
    await executeCommand(historyPage, 'View: Open AI-Native Chat Layout')
    await expect.poll(() => new URL(historyPage.url()).pathname).toBe('/chat')
    await expect(historyPage.getByRole('heading', { name: 'What would you like to work on?' })).toBeVisible()
    await historyPage.goBack()
    await expect.poll(() => new URL(historyPage.url()).pathname).toBe('/board')
    await expect(historyPage.locator('.BoardView')).toBeVisible()
    await directContext.close()

    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await page.goto(`${url}/chat`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    await expect(page.locator('.ChatAiNativeLayout')).toBeVisible()
    const composer = page.getByRole('textbox', { name: 'Message', exact: true })
    await composer.focus()
    await expect(composer).toBeFocused()
    const command = (label) => executeCommand(page, label)
    const expectPath = (path) => expect.poll(() => new URL(page.url()).pathname).toBe(path)
    const getChatGeometry = () =>
      page.locator('.ChatAiNativeLayout').evaluate((chat) => {
        const rect = chat.getBoundingClientRect()
        const detail = chat.querySelector('.ChatDetailView')?.getBoundingClientRect()
        const composer = chat.querySelector('.ChatComposerArea')?.getBoundingClientRect()
        return { chatWidth: rect.width, detailWidth: detail?.width ?? 0, composerWidth: composer?.width ?? 0 }
      })
    await command('View: Open Board Layout')
    await expectPath('/boards')
    await expect(page.locator('.BoardSetupTitle')).toHaveText('Connect a board')
    await page.goto(`${url}/chat`, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.ChatAiNativeLayout')).toBeVisible()
    const directChatGeometry = await getChatGeometry()
    expect(directChatGeometry.chatWidth).toBeGreaterThan(1000)
    expect(directChatGeometry.detailWidth).toBeGreaterThan(700)
    expect(directChatGeometry.composerWidth).toBeGreaterThan(500)
    await expectPath('/chat')
    const activityBar = page.locator('.ActivityBarLayout')
    for (let index = 0; index < 2; index++) {
      await command('Layout: Toggle Activity Bar')
      await expect(activityBar).toBeHidden()
      await command('Layout: Toggle Activity Bar')
      await expect(activityBar).toBeVisible()
      await expect(activityBar.getByRole('button', { name: 'Settings', exact: true })).toBeVisible()
      await expect(activityBar.getByRole('tab')).toHaveCount(0)
      await expect(page.locator('.ChatAiNativeLayout')).toBeVisible()
      await expectPath('/chat')
    }
    await new Promise((resolve) => setTimeout(resolve, 750))
    await activityBar.dispatchEvent('wheel', { deltaY: -100, bubbles: true })
    await expect(page.locator('.BoardView')).toBeVisible()
    await expectPath('/boards')
    await new Promise((resolve) => setTimeout(resolve, 750))
    await activityBar.dispatchEvent('wheel', { deltaY: 100, bubbles: true })
    await expect(page.locator('.ChatAiNativeLayout')).toBeVisible()
    await expectPath('/chat')
    await expect.poll(getChatGeometry).toEqual(directChatGeometry)
    await page.setViewportSize({ width: 1024, height: 700 })
    await expect.poll(async () => (await getChatGeometry()).chatWidth).toBeGreaterThan(900)
    const resizedChatGeometry = await getChatGeometry()
    for (let index = 0; index < 2; index++) {
      await new Promise((resolve) => setTimeout(resolve, 750))
      await activityBar.dispatchEvent('wheel', { deltaY: -100, bubbles: true })
      await expect(page.locator('.BoardView')).toBeVisible()
      await expectPath('/boards')
      await expect.poll(async () => (await page.locator('.BoardView').boundingBox())?.width ?? 0).toBeGreaterThan(900)
      await new Promise((resolve) => setTimeout(resolve, 750))
      await activityBar.dispatchEvent('wheel', { deltaY: 100, bubbles: true })
      await expect(page.locator('.ChatAiNativeLayout')).toBeVisible()
      await expectPath('/chat')
      await expect.poll(getChatGeometry).toEqual(resizedChatGeometry)
    }
  })
})

test('activity bar Settings switches between IDE, Chat, and Board layouts', { timeout: 120_000 }, async () => {
  await withWorkbench({ 'chat2.useMockBackend': true, 'chat2.experimentalFocusMode': true }, async (browser, url) => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    await page.goto(url)
    const activityBar = page.locator('.ActivityBarLayout')
    const chat = page.locator('.ChatAiNativeLayout')
    const board = page.locator('.BoardView')
    const expectPath = (path) => expect.poll(() => new URL(page.url()).pathname).toBe(path)
    const selectLayout = async (label) => {
      await activityBar.getByRole('button', { name: 'Settings', exact: true }).click()
      await page.getByRole('menuitem', { name: 'Layout', exact: true }).hover()
      await page.getByRole('menuitem', { name: label, exact: true }).click()
    }

    await selectLayout('Chat')
    await expectPath('/chat')
    await expect(chat).toBeVisible()
    await selectLayout('Board')
    await expectPath('/boards')
    await expect(board).toBeVisible()
    await selectLayout('IDE')
    await expectPath('/')
    await expect(activityBar.getByRole('tab', { name: 'Explorer' })).toBeVisible()
    await expect(board).toBeHidden()
    await expect(chat).toBeHidden()
  })
})

test('board stays visible while the separate chat worker initializes', { timeout: 120_000 }, async () => {
  await withWorkbench({ 'chat2.backendUrl': 'https://layout-transition.test', 'chat2.useMockBackend': false }, async (browser, url) => {
    await testLayoutTransition(browser, `${url}/`)
  })
})
