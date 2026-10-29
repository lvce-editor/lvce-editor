import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:https'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { _electron, expect } from '@playwright/test'
import electronPath from 'electron'

const root = resolve('.')
const profile = await mkdtemp(join(tmpdir(), 'lvce-auth-lifecycle-'))
const evidence = process.env.LVCE_AUTH_EVIDENCE_DIR
const diagnostics = []
const exchanges = []
const server = createServer(
  {
    key: await readFile(new URL('./fixtures/auth-lifecycle/localhost.key', import.meta.url)),
    cert: await readFile(new URL('./fixtures/auth-lifecycle/localhost.crt', import.meta.url)),
  },
  async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    response.setHeader('Content-Type', 'application/json')
    if (request.method === 'OPTIONS') {
      response.end('{}')
      return
    }
    if (request.url === '/oidc/token') {
      let body = ''
      for await (const chunk of request) body += chunk
      exchanges.push(Object.fromEntries(new URLSearchParams(body)))
      if (exchanges.length === 3) {
        response.statusCode = 400
        response.end(JSON.stringify({ error: 'invalid_grant' }))
        return
      }
      response.end(JSON.stringify({ access_token: 'test-access', refresh_token: 'test-refresh', token_type: 'Bearer', expires_in: 3600 }))
      return
    }
    if (request.url === '/account/me') {
      response.end(JSON.stringify({ id: 'test-account', displayName: 'Auth Lifecycle User', email: 'test@example.invalid' }))
      return
    }
    response.end('{}')
  },
)
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const backend = `https://127.0.0.1:${server.address().port}`
const env = { ...process.env }
for (const key of ['CONFIG', 'DATA', 'CACHE', 'STATE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
delete env.ELECTRON_RUN_AS_NODE
if (process.env.LVCE_AUTH_PACKAGED === '1') {
  for (const key of ['LVCE_ROOT', 'LVCE_SHARED_PROCESS_PATH', 'DEV']) delete env[key]
} else {
  env.LVCE_ROOT = root
  env.LVCE_SHARED_PROCESS_PATH = join(root, 'packages/shared-process/src/sharedProcessMain.ts')
  env.DEV = '1'
}
await mkdir(join(env.XDG_CONFIG_HOME, 'lvce-oss'), { recursive: true })
await writeFile(
  join(env.XDG_CONFIG_HOME, 'lvce-oss/settings.json'),
  JSON.stringify({
    'layout.backendUrl': backend,
    'sessionReplay.enabled': false,
    'workbench.saveStateOnVisibilityChange': false,
    'window.titleBarStyle': 'native',
  }),
)
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
const startLogin = (page) =>
  page.evaluate(async () => {
    const script = [...document.querySelectorAll('script[type="module"]')].find((node) => node.src.includes('rendererProcessMain'))
    const renderer = await import(script.src)
    await renderer.ready
    globalThis.authLifecycleLogin = renderer.executeCommand('Layout.signIn')
    // Observe failures immediately, while assertions wait for the mock browser URL.
    globalThis.authLifecycleLogin.catch(() => {})
  })
let app
const urls = () => app.evaluate(() => globalThis.authLifecycleUrls)
const authPids = () =>
  app.evaluate(({ app }) =>
    app
      .getAppMetrics()
      .filter((item) => /auth[- ]process/i.test(item.name || item.serviceName || ''))
      .map((item) => item.pid),
  )
const observe = async (page) => {
  page.on('console', (message) => diagnostics.push(message.text()))
  page.on('pageerror', (error) => diagnostics.push(String(error)))
  await expect(page.locator('.Main')).toBeVisible({ timeout: 90_000 })
}
const complete = async (index) => {
  const login = new URL((await urls())[index])
  assert.equal(login.searchParams.get('client_id'), 'lvce-editor-native')
  assert.ok(login.searchParams.get('code_challenge'))
  const callback = new URL(login.searchParams.get('redirect_uri'))
  callback.searchParams.set('code', `test-code-${index}`)
  const response = await fetch(callback)
  assert.equal(response.status, 200)
}
try {
  app = await _electron.launch({
    executablePath: process.env.LVCE_ELECTRON_PATH || electronPath,
    args: [
      '--no-sandbox',
      '--ignore-certificate-errors',
      '--password-store=basic',
      `--user-data-dir=${join(profile, 'chromium')}`,
      ...(process.env.LVCE_AUTH_PACKAGED === '1' ? [] : [join(root, 'packages/main-process')]),
    ],
    env,
    timeout: 90_000,
  })
  assert.equal(await app.evaluate(() => process.env.XDG_CONFIG_HOME), env.XDG_CONFIG_HOME)
  await app.evaluate(({ shell }) => {
    globalThis.authLifecycleUrls = []
    shell.openExternal = async (url) => {
      globalThis.authLifecycleUrls.push(url)
    }
  })
  const first = await app.firstWindow()
  await observe(first)
  await execute(first, 'Main.openInput', { editorInput: { type: 'process-explorer' }, focus: true })
  await expect(first.locator('.ProcessExplorer')).toBeVisible()
  await expect.poll(authPids).toEqual([])
  const newWindow = app.waitForEvent('window', { timeout: 90_000 })
  await execute(first, 'Main.newWindow')
  const second = await newWindow
  await observe(second)
  await startLogin(first)
  await expect.poll(async () => (await urls()).length).toBe(1)
  await expect.poll(async () => (await authPids()).length).toBe(1)
  const [originalPid] = await authPids()
  await startLogin(second)
  await expect.poll(async () => (await urls()).length).toBe(2)
  assert.deepEqual(await authPids(), [originalPid])
  await complete(0)
  await first.evaluate(() => globalThis.authLifecycleLogin)
  assert.equal((await execute(first, 'Layout.getAuthState')).signInState, 'loggedIn')
  assert.deepEqual(await authPids(), [originalPid], 'Completing one client must retain the other client’s process')
  await complete(1)
  await second.evaluate(() => globalThis.authLifecycleLogin)
  await expect.poll(authPids).toEqual([])
  await expect(first.locator('.ProcessExplorer')).not.toContainText(/auth[- ]process/i)
  await startLogin(second)
  await expect.poll(async () => (await urls()).length).toBe(3)
  const [replacementPid] = await authPids()
  assert.ok(replacementPid)
  assert.notEqual(replacementPid, originalPid)
  await complete(2)
  await second.evaluate(() => globalThis.authLifecycleLogin)
  await expect.poll(authPids).toEqual([])
  await startLogin(second)
  await expect.poll(async () => (await urls()).length).toBe(4)
  await second.close()
  await expect.poll(authPids).toEqual([])
  assert.equal(exchanges.length, 3)
  assert.ok(exchanges.every((exchange) => exchange.code_verifier && exchange.client_id === 'lvce-editor-native'))
  if (evidence) {
    await mkdir(evidence, { recursive: true })
    await first.screenshot({ path: join(evidence, 'idle-process-explorer.png') })
    await writeFile(
      join(evidence, 'assertions.json'),
      JSON.stringify({ originalPid, replacementPid, exchanges: exchanges.length, passed: true }, null, 2),
    )
  }
} finally {
  if (app) await app.close()
  await new Promise((resolve) => server.close(resolve))
  if (evidence) {
    await mkdir(evidence, { recursive: true })
    await writeFile(join(evidence, 'diagnostics.json'), JSON.stringify(diagnostics, null, 2))
  }
  await rm(profile, { recursive: true, force: true })
}
