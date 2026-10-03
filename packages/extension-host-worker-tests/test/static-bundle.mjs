import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdir, readFile, writeFile, symlink, rm } from 'node:fs/promises'
import { resolve, join, extname } from 'node:path'
import { chromium } from '@playwright/test'
import { pathToFileURL } from 'node:url'

// These artifacts are produced after type-checking by the server build.
const loadBuiltModule = (path) => import(pathToFileURL(resolve('packages/build/.tmp/server/shared-process', path)).href)
const { createWorkerFactory } = await loadBuiltModule('src/parts/BundleStaticWorkers/BundleStaticWorkers.js')
const { createBundledWorkerConstructor } = await loadBuiltModule('src/parts/BundledWorkerRuntime/BundledWorkerRuntime.js')
const { exportStatic } = await loadBuiltModule('index.js')

const root = resolve('packages/build/.tmp/bundle-acceptance')
const fixture = join(root, 'extension')
await mkdir(join(fixture, 'src'), { recursive: true })
// Exercise a real, packaged extension API and worker handshake without network access.
const manifest = JSON.parse(await readFile('extensions/builtin.language-features-nvmrc/extension.json', 'utf8'))
await writeFile(join(fixture, 'extension.json'), JSON.stringify({ ...manifest, languages: [], browser: 'src/main.js' }))
await writeFile(join(fixture, 'src/main.js'), await readFile('extensions/builtin.language-features-nvmrc/dist/languageFeaturesNvmrcMain.js'))
const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' }
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url || '/', 'http://localhost').pathname
    const path = join(root, pathname.endsWith('/') ? pathname + 'index.html' : pathname)
    const content = await readFile(path)
    response.setHeader('Content-Type', mimeTypes[extname(path)] || 'application/octet-stream')
    response.end(content)
  } catch {
    response.writeHead(404).end()
  }
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)))
const address = server.address()
assert.ok(address && typeof address !== 'string')
let browser
const results = []
const measureHeaps = async () => {
  const connection = await browser.newBrowserCDPSession()
  const heaps = []
  try {
    const { targetInfos } = await connection.send('Target.getTargets')
    for (const target of targetInfos.filter((target) => ['page', 'worker'].includes(target.type))) {
      const { sessionId } = await connection.send('Target.attachToTarget', { targetId: target.targetId })
      let listener
      let timeout
      try {
        const response = new Promise((resolve, reject) => {
          listener = (event) => {
            if (event.sessionId !== sessionId) return
            const message = JSON.parse(event.message)
            if (message.id === 1) {
              if (message.error) reject(new Error(JSON.stringify(message.error)))
              else resolve(message.result)
            }
          }
          connection.on('Target.receivedMessageFromTarget', listener)
          timeout = setTimeout(() => reject(new Error('Heap measurement timed out')), 5000)
        })
        await connection.send('Target.sendMessageToTarget', { sessionId, message: JSON.stringify({ id: 1, method: 'Runtime.getHeapUsage' }) })
        const heap = await response
        heaps.push({ type: target.type, usedSize: heap.usedSize, backingStorageSize: heap.backingStorageSize })
      } finally {
        clearTimeout(timeout)
        connection.off('Target.receivedMessageFromTarget', listener)
        await connection.send('Target.detachFromTarget', { sessionId })
      }
    }
    return heaps
  } finally {
    await connection.detach()
  }
}
const deadline = setTimeout(() => {
  console.error('Static bundle acceptance exceeded 120 seconds')
  void browser?.close()
}, 120_000)
try {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.BUNDLE_CHROME_PATH,
    args: ['--no-sandbox', '--enable-precise-memory-info'],
  })
  for (const bundleMode of [undefined, false, true]) {
    const name = bundleMode === undefined ? 'default' : String(bundleMode)
    const directory = join(root, name)
    await mkdir(join(directory, 'node_modules/@lvce-editor'), { recursive: true })
    const link = join(directory, 'node_modules/@lvce-editor/static-server')
    await rm(link, { force: true, recursive: true })
    await symlink(resolve('packages/build/.tmp/server/static-server'), link, 'junction')
    const prefix = `/${name}/dist`
    process.env.PATH_PREFIX = prefix
    const { commitHash } = await exportStatic({
      bundleMode,
      root: directory,
      pathPrefix: prefix,
      extensionPath: fixture,
    })
    const cacheUrl = `${prefix}/${commitHash}/packages/cache-worker/cacheWorkerMain.js`
    const cacheFactory = await createWorkerFactory(join(directory, 'dist', commitHash, 'packages/cache-worker/cacheWorkerMain.js'), cacheUrl)
    await writeFile(
      join(directory, 'dist/cache-runtime.js'),
      `export const Worker = (${createBundledWorkerConstructor.toString()})({${cacheFactory}}, globalThis);`,
    )
    const entry = bundleMode ? 'renderer-process.bundled.js' : 'rendererProcessMain.js'
    const html = await readFile(join(directory, 'dist/index.html'), 'utf8')
    assert.ok(html.includes(`/${entry}`))
    const context = await browser.newContext()
    const page = await context.newPage()
    page.setDefaultTimeout(15_000)
    const workers = []
    const errors = []
    page.on('worker', (worker) => workers.push(worker.url()))
    page.on('pageerror', (error) => errors.push(error.message))
    const start = Date.now()
    await page.goto(`http://127.0.0.1:${address.port}${prefix}/`)
    await page.getByRole('tab', { name: 'Explorer', exact: true }).waitFor()
    const startupMs = Date.now() - start
    const moduleUrl = `${prefix}/${commitHash}/packages/renderer-process/dist/${entry}`
    await page.evaluate(async (url) => {
      const { executeCommand } = await import(url)
      await executeCommand('FileSystem.mkdir', 'memfs:///bundle-test')
      await executeCommand('FileSystem.writeFile', 'memfs:///bundle-test/sample.js', 'const answer = 42\n')
      await executeCommand('Workspace.setUri', 'memfs:///bundle-test')
      await executeCommand('Main.openUri', 'memfs:///bundle-test/sample.js')
      await executeCommand('ExtensionHost.executeCommand', 'nvmrc.test.setNodeReleases', [{ version: 'v24.0.0', lts: 'Krypton' }])
    }, moduleUrl)
    await page.getByRole('treeitem', { name: 'sample.js', exact: true }).waitFor()
    await page.getByRole('textbox').focus()
    await page.keyboard.insertText('// bundled\n')
    await page.locator('body').filter({ hasText: '// bundled' }).waitFor()
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+s' : 'Control+s')
    await page.waitForFunction(async (url) => {
      const { executeCommand } = await import(url)
      return (await executeCommand('FileSystem.readFile', 'memfs:///bundle-test/sample.js')).startsWith('// bundled\n')
    }, moduleUrl)
    await page.getByRole('treeitem', { name: 'sample.js', exact: true }).click({ button: 'right' })
    await page.getByRole('menuitem', { name: /Rename/ }).click()
    const input = page.locator('input').filter({ visible: true })
    await input.fill('renamed.js')
    await input.press('Enter')
    await page.waitForFunction(async (url) => {
      const { executeCommand } = await import(url)
      return executeCommand('FileSystem.exists', 'memfs:///bundle-test/renamed.js')
    }, moduleUrl)
    await page.getByRole('button', { name: 'Refresh Explorer', exact: true }).click()
    await page.getByRole('treeitem', { name: 'renamed.js', exact: true }).waitFor()
    const evidence = await page.evaluate(() => ({
      resources: performance.getEntriesByType('resource').map((entry) => entry.name),
      usedHeap: /** @type {Performance & {memory: {usedJSHeapSize: number}}} */ (performance).memory.usedJSHeapSize,
    }))
    assert.ok(
      evidence.resources.some((url) => url.endsWith('/file_type_js.svg')),
      'JavaScript file icon loaded',
    )
    assert.ok(
      workers.some((url) => url.endsWith('/extensions/builtin.language-features-nvmrc/src/main.js')),
      `Native extension worker missing: ${workers}`,
    )
    const included = [
      'rendererWorkerMain.js',
      'editorWorkerMain.js',
      'extensionManagementWorkerMain.js',
      'iconThemeWorkerMain.js',
      'cacheWorkerMain.js',
      'explorerViewWorkerMain.js',
    ]
    if (bundleMode) {
      assert.deepEqual(
        workers.filter((url) => included.some((name) => url.endsWith(name))),
        [],
      )
    } else {
      for (const name of included.filter((name) => name !== 'cacheWorkerMain.js'))
        assert.ok(
          workers.some((url) => url.endsWith(name)),
          `${name} missing`,
        )
    }
    const heaps = await measureHeaps()
    const roundTripMs = await page.evaluate(async (url) => {
      const { executeCommand } = await import(url)
      const start = performance.now()
      for (let i = 0; i < 10; i++) await executeCommand('Workspace.getUri')
      return (performance.now() - start) / 10
    }, moduleUrl)
    const cacheResult = await page.evaluate(
      async ({ bundleMode, cacheUrl, prefix }) => {
        const Constructor = bundleMode ? (await import(`${prefix}/cache-runtime.js`)).Worker : Worker
        const worker = new Constructor(cacheUrl, { type: 'module' })
        const next = () =>
          new Promise((resolve, reject) => {
            worker.onmessage = (event) => resolve(event.data)
            worker.onerror = reject
          })
        let id = 0
        const invoke = async (method, ...params) => {
          const response = next()
          worker.postMessage({ jsonrpc: '2.0', id: ++id, method, params })
          const result = await response
          if (result.error) throw new Error(JSON.stringify(result.error))
          return result.result
        }
        try {
          if ((await next()) !== 'ready') throw new Error('Missing cache worker readiness')
          const key = new URL('/cache-probe', location.href).href
          await invoke('Cache.setCacheStorageItem', key, 'cache works', 'bundle-acceptance')
          const result = await invoke('Cache.getCacheStorageItem', key, 'bundle-acceptance')
          await invoke('Cache.removeCacheStorageItem', key, 'bundle-acceptance')
          return new TextDecoder().decode(result.body)
        } finally {
          worker.terminate()
        }
      },
      { bundleMode, cacheUrl, prefix },
    )
    assert.equal(cacheResult, 'cache works')
    assert.deepEqual(errors, [])
    results.push({
      bundleMode: name,
      startupMs,
      mainThreadUsedHeap: evidence.usedHeap,
      totalUsedHeap: heaps.reduce((total, heap) => total + heap.usedSize, 0),
      measuredContexts: heaps.length,
      roundTripMs,
      nativeWorkers: workers.length,
    })
    await context.close()
  }
  console.log(JSON.stringify(results, null, 2))
} finally {
  clearTimeout(deadline)
  await browser?.close()
  await new Promise((resolve) => server.close(resolve))
}
