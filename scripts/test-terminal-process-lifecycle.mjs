import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requireTests = createRequire(join(root, 'packages/extension-host-worker-tests/package.json'))
const { expect } = requireTests('@playwright/test')
const { _electron } = requireTests('playwright')
const { build } = createRequire(join(root, 'packages/build/package.json'))('esbuild')
const profile = await mkdtemp(join(tmpdir(), 'lvce-terminal-process-lifecycle-'))
const rendererPath = join(root, 'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist/rendererProcessMain.js')
const rendererSource = await readFile(rendererPath, 'utf8')
const entry = '/packages/renderer-worker/src/rendererWorkerMain.ts'
assert.ok(rendererSource.includes(entry), 'Renderer entry must be clean')
const bundleUrl = '/packages/renderer-worker/dist/terminalLifecycleTestMain.js'
let app
try {
  await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
  await writeFile(join(profile, 'config/lvce-oss/settings.json'), JSON.stringify({ 'terminal.backend': 'real' }))
  await build({
    stdin: {
      contents: `import './packages/renderer-worker/src/rendererWorkerMain.ts'; import * as Command from './packages/renderer-worker/src/parts/Command/Command.js'; globalThis.terminalLifecycleCommand = Command.execute;`,
      resolveDir: root,
    },
    outfile: join(root, bundleUrl),
    bundle: true,
    format: 'esm',
    platform: 'browser',
    external: ['node:*', '/static/*', 'electron'],
    logLevel: 'error',
  })
  await writeFile(rendererPath, rendererSource.replace(entry, bundleUrl))
  const env = { ...process.env, DEV: '1', LVCE_ROOT: root, LVCE_SHARED_PROCESS_PATH: join(root, 'packages/shared-process/src/sharedProcessMain.ts') }
  delete env.ELECTRON_RUN_AS_NODE
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
  app = await _electron.launch({
    executablePath:
      process.env.LVCE_TEST_ELECTRON ||
      createRequire(join(root, 'packages/main-process/node_modules/@lvce-editor/main-process/package.json'))('electron'),
    args: ['--no-sandbox', `--user-data-dir=${join(profile, 'chromium')}`, '.', profile],
    cwd: join(root, 'packages/main-process'),
    env,
  })
  app.process().stderr.on('data', (data) => process.stderr.write(data))
  const childEnv = await app.evaluate(() =>
    Object.fromEntries(['CONFIG', 'DATA', 'STATE', 'CACHE'].map((key) => [key, process.env[`XDG_${key}_HOME`]])),
  )
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) assert.equal(childEnv[key], join(profile, key.toLowerCase()))
  const command = async (page, ...args) => {
    await expect.poll(() => page.workers().some((worker) => worker.url().includes('terminalLifecycleTestMain'))).toBe(true)
    const worker = page.workers().find((worker) => worker.url().includes('terminalLifecycleTestMain'))
    return worker.evaluate((args) => globalThis.terminalLifecycleCommand(...args), args)
  }
  const processes = () =>
    app.evaluate(({ app }) =>
      app
        .getAppMetrics()
        .filter((metric) => metric.name === 'Terminal Process' || metric.serviceName === 'Terminal Process')
        .map((metric) => metric.pid),
    )
  const open = async (page) => {
    await page.bringToFront()
    const window = await app.browserWindow(page)
    await window.evaluate((window) => window.focus())
    await command(page, 'Layout.showPanel', 'Terminals')
    await expect(page.locator('.XtermTerminal')).toHaveCount(1)
    await expect(page.locator('.XtermTerminal .xterm-helper-textarea')).toBeVisible()
  }
  const checkOutput = async (page, text) => {
    const input = page.locator('.XtermTerminal .xterm-helper-textarea')
    const middle = Math.floor(text.length / 2)
    await page.bringToFront()
    const window = await app.browserWindow(page)
    await window.evaluate((window) => window.focus())
    await input.focus()
    await expect(input).toBeFocused()
    const command = `printf '%s%s\\n' '${text.slice(0, middle)}' '${text.slice(middle)}'`
    for (const char of command) await page.keyboard.press(char === ' ' ? 'Space' : char)
    await page.keyboard.press('Enter')
    await expect(page.locator('.XtermTerminal')).toContainText(text)
  }
  const readSize = async (page, label) => {
    await page.locator('.xterm-helper-textarea').focus()
    await page.keyboard.type(`printf '${label}:%s\\n' "$(stty size)"`)
    await page.keyboard.press('Enter')
    const pattern = new RegExp(`${label}:(\\d+) (\\d+)`)
    await expect(page.locator('.XtermTerminal')).toContainText(pattern)
    return (await page.locator('.XtermTerminal').textContent()).match(pattern).slice(1)
  }
  const close = async (page) => {
    await page.locator('.Panel .IconButton[title="Kill Terminal"]').click()
    await expect(page.locator('.XtermTerminal')).toHaveCount(0)
  }
  const first = await app.firstWindow()
  await expect(first.locator('#Workbench')).toBeVisible()
  await open(first)
  await checkOutput(first, 'first-window-ready')
  await expect.poll(processes).toHaveLength(1)
  const [originalPid] = await processes()
  await command(first, 'Window.openNew')
  await expect.poll(() => app.context().pages().length).toBe(2)
  const second = app
    .context()
    .pages()
    .find((page) => page !== first)
  await expect(second.locator('#Workbench')).toBeVisible()
  await open(second)
  await checkOutput(second, 'second-window-ready')
  assert.deepEqual(await processes(), [originalPid])
  await close(first)
  await checkOutput(second, 'survived-first-close')
  assert.deepEqual(await processes(), [originalPid])
  await close(second)
  await expect.poll(processes).toEqual([])
  for (let cycle = 0; cycle < 3; cycle++) {
    await open(first)
    await checkOutput(first, `reopened-${cycle}`)
    await expect.poll(processes).toHaveLength(1)
    assert.notEqual((await processes())[0], originalPid)
    const originalSize = await readSize(first, `size-before-${cycle}`)
    const window = await app.browserWindow(first)
    await window.evaluate((window, cycle) => window.setSize(850 + cycle * 100, 550 + cycle * 100), cycle)
    let sample = 0
    await expect.poll(() => readSize(first, `size-after-${cycle}-${sample++}`)).not.toEqual(originalSize)
    await checkOutput(first, `resized-${cycle}`)
    // A new connection is acquired while the other window closes its last terminal.
    await Promise.all([close(first), open(second)])
    await checkOutput(second, `race-survivor-${cycle}`)
    await close(second)
    await expect.poll(processes).toEqual([])
  }
  await open(first)
  await open(second)
  await second.close()
  await checkOutput(first, 'survived-window-close')
  await expect.poll(processes).toHaveLength(1)
  await close(first)
  await expect.poll(processes).toEqual([])
  console.log('PASS: terminal process retirement, multiwindow ownership, input/output, resize, and repeated close/open races')
} finally {
  try {
    await app?.close()
  } finally {
    await writeFile(rendererPath, rendererSource)
    await rm(profile, { recursive: true, force: true })
  }
}
