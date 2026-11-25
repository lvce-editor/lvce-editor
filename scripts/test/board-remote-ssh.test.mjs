import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { _electron, expect } from '@playwright/test'
import electronPath from 'electron'

const root = fileURLToPath(new URL('../../', import.meta.url))
const workspaceUri = 'remote-ssh://127.0.0.1:1/board-startup-test'

const execute = (page, command, ...args) =>
  page.evaluate(
    async ({ command, args }) => {
      const script = [...document.querySelectorAll('script[type="module"]')].find((node) => node.src.includes('rendererProcessMain'))
      const renderer = await import(script.src)
      await renderer.ready
      return renderer.executeCommand(command, ...args)
    },
    { command, args },
  )

test('Boards defers the saved Remote SSH workspace and allows native window close', { timeout: 180_000 }, async () => {
  const profile = await mkdtemp(join(tmpdir(), 'lvce-board-remote-ssh-'))
  const env = {
    ...process.env,
    DEV: '1',
    LVCE_ROOT: root,
    LVCE_SHARED_PROCESS_PATH: join(root, 'packages/shared-process/src/sharedProcessMain.ts'),
  }
  delete env.ELECTRON_RUN_AS_NODE
  for (const key of ['CONFIG', 'DATA', 'CACHE', 'STATE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
  const config = join(env.XDG_CONFIG_HOME, 'lvce-oss')
  let app
  try {
    await mkdir(config, { recursive: true })
    await writeFile(
      join(config, 'settings.json'),
      JSON.stringify({ 'chat2.useMockBackend': true, 'sessionReplay.enabled': false, 'workbench.saveStateOnVisibilityChange': false }),
    )
    app = await _electron.launch({
      executablePath: electronPath,
      args: ['--no-sandbox', '--password-store=basic', `--user-data-dir=${join(profile, 'chromium')}`, 'packages/main-process'],
      cwd: root,
      env,
      timeout: 90_000,
    })
    assert.equal(await app.evaluate(() => process.env.XDG_CONFIG_HOME), env.XDG_CONFIG_HOME)
    const page = await app.firstWindow()
    await expect(page.locator('.Main')).toBeVisible({ timeout: 90_000 })
    await page.evaluate((uri) => {
      localStorage.setItem('Layout', JSON.stringify({ aiNativeLayout: true, sideBarView: 'chat2.views.board' }))
      sessionStorage.setItem('workspace', JSON.stringify({ homeDir: '', path: uri, pathSeparator: '/', uri }))
    }, workspaceUri)

    const expectBoardsWithoutSsh = async () => {
      await expect(page.locator('.BoardSetupTitle')).toHaveText('Connect a board', { timeout: 30_000 })
      assert.equal(await execute(page, 'Workspace.getUri'), '')
      assert.equal(await execute(page, 'Main.hasDirtyTabs'), false)
      const extensions = await execute(page, 'ExtensionManagement.getRunningExtensions')
      assert.ok(!extensions.some(({ id }) => id === 'builtin.remote-ssh'))
      await expect(page.getByText('Loading Remote SSH Workspace…')).toHaveCount(0)
    }
    for (let reload = 0; reload < 2; reload++) {
      await page.reload()
      await expectBoardsWithoutSsh()
      await execute(page, 'SaveState.handleVisibilityChange', 'hidden')
    }

    await execute(page, 'ExtensionHost.executeCommand', 'chat2.showIdeLayout')
    assert.equal(await execute(page, 'Workspace.getUri'), workspaceUri)
    await expect(page.locator('.BoardView')).toBeHidden()

    await page.evaluate(() => {
      localStorage.removeItem('Layout')
      sessionStorage.removeItem('workspace')
    })
    const boardUrl = new URL('/board', page.url())
    boardUrl.searchParams.set('workspace', workspaceUri)
    await page.goto(boardUrl.href)
    await expectBoardsWithoutSsh()

    const nativeWindow = await app.browserWindow(page)
    const closed = page.waitForEvent('close', { timeout: 10_000 })
    await Promise.all([
      closed,
      nativeWindow.evaluate((window) => {
        setImmediate(() => window.close())
      }),
    ])
  } finally {
    // Force cleanup if the native close handshake fails.
    const child = app?.process()
    if (child?.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit')
      await app
        .evaluate(({ app }) => {
          setImmediate(() => app.exit(0))
        })
        .catch(() => child.kill())
      await exited
    }
    await rm(profile, { recursive: true, force: true })
  }
})
