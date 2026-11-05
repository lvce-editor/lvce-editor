import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from '@playwright/test'
import { createFixture } from '../../.tmp/remote-account-tests/packages/e2e/scripts/remote-web-fixture.js'

// Stub only account metadata and DNS routing. Exchange real account grants,
// start real remote processes, and read/save through their WebSocket transport.
const first = await createFixture({ accountOnly: true })
let second
let browser
try {
  const previous = process.env.LVCE_REMOTE_WEB_FRONTEND_URL
  process.env.LVCE_REMOTE_WEB_FRONTEND_URL = first.url
  try {
    second = await createFixture({ accountOnly: true })
  } finally {
    if (previous === undefined) delete process.env.LVCE_REMOTE_WEB_FRONTEND_URL
    else process.env.LVCE_REMOTE_WEB_FRONTEND_URL = previous
  }
  const targets = new Map([
    ['first.test', first],
    ['second.test', second],
  ])
  browser = await chromium.launch({ headless: true })
  for (const [hostname, fixture] of targets) {
    const context = await browser.newContext({ ignoreHTTPSErrors: true })
    try {
      const authorizations = []
      await context.route('**/cloudflare/status', (route) =>
        route.fulfill({
          json: {
            machines: [...targets.keys()].map((hostname) => ({ hostname, disabled: false, browserAccess: true })),
          },
        }),
      )
      await context.route('**/cloudflare/browser-session', async (route) => {
        const target = route.request().postDataJSON().hostname
        authorizations.push(target)
        await route.fulfill({ json: { publicUrl: `https://${target}`, authorization: targets.get(target).authorizeBrowser() } })
      })
      for (const [target, remote] of targets) {
        await context.route(`https://${target}/**`, async (route) => {
          const url = new URL(route.request().url())
          const response = await route.fetch({ url: new URL(url.pathname + url.search, remote.publicUrl).href })
          if (url.pathname === '/auth/account' && response.ok()) {
            const session = await response.json()
            await route.fulfill({ response, json: { ...session, websocketUrl: `wss://${target}/` } })
          } else await route.fulfill({ response })
        })
        await context.routeWebSocket(`wss://${target}/**`, (socket) => {
          const url = new URL(socket.url())
          const upstream = new URL(url.pathname + url.search, remote.publicUrl.replace('https:', 'wss:'))
          socket.connectToServer(upstream.href)
        })
      }
      const page = await context.newPage()
      await page.goto(new URL('account-browser-test.html', first.url).href)
      await page.evaluate(async (backendUrl) => {
        localStorage.setItem('settings', JSON.stringify({ 'layout.backendUrl': backendUrl }))
        const request = indexedDB.open('auth-worker', 1)
        request.onupgradeneeded = () => request.result.createObjectStore('auth')
        const database = await new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result)
          request.onerror = () => reject(request.error)
        })
        const id = `${backendUrl}/launch-fixture`
        const transaction = database.transaction('auth', 'readwrite')
        transaction.objectStore('auth').put(
          JSON.stringify({
            revision: 1,
            activeId: id,
            accounts: [
              {
                backendUrl,
                id,
                profile: { id: 'launch-fixture', displayName: 'Launch fixture', email: 'launch@example.test', provider: 'test' },
                session: {
                  userState: 'loggedIn',
                  authAccessToken: 'fixture-only-token',
                  authAccessTokenExpiresAt: Date.now() + 3600000,
                  userName: 'Launch fixture',
                },
              },
            ],
          }),
          'accountSessions',
        )
        await new Promise((resolve, reject) => {
          transaction.oncomplete = resolve
          transaction.onerror = () => reject(transaction.error)
        })
        database.close()
      }, new URL(first.url).origin)
      const launchUrl = new URL(first.url)
      launchUrl.searchParams.set('remoteServer', hostname)
      await page.goto(launchUrl.href)
      await page.getByRole('treeitem', { name: 'hello.txt', exact: true }).waitFor({ timeout: 30000 })
      assert.deepEqual(authorizations, [hostname], 'Launch must authorize only the selected machine')
      const workspaceUri = `remote-server://${hostname}${fixture.workspace}`
      await page.waitForURL((url) => url.hash === `#workspace=${encodeURIComponent(workspaceUri)}`)
      await page.getByRole('treeitem', { name: 'hello.txt', exact: true }).dblclick()
      await page.locator('.EditorInput textarea').focus()
      await page.keyboard.press('Control+Home')
      await page.keyboard.insertText(`Saved through ${hostname}\n`)
      await page.keyboard.press('Control+s')
      const deadline = Date.now() + 10000
      while (!(await readFile(join(fixture.workspace, 'hello.txt'), 'utf8')).startsWith(`Saved through ${hostname}\n`)) {
        assert.ok(Date.now() < deadline, 'Remote editor save did not reach the selected server')
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      const other = hostname === 'first.test' ? second : first
      assert.ok(!(await readFile(join(other.workspace, 'hello.txt'), 'utf8')).includes(`Saved through ${hostname}`))
      console.log(`PASS launch ${hostname}: configured workspace, remote read/save, no machine picker`)
    } finally {
      await context.close()
    }
  }
} finally {
  await browser?.close()
  await second?.dispose()
  await first.dispose()
}
