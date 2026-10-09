import { existsSync } from 'node:fs'
import { VError } from '@lvce-editor/verror'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as Copy from '../Copy/Copy.ts'
import * as Mkdir from '../Mkdir/Mkdir.ts'
import * as Path from '../Path/Path.ts'
import * as ReadFile from '../ReadFile/ReadFile.ts'
import * as ReadDir from '../ReadDir/ReadDir.ts'
import * as Remove from '../Remove/Remove.ts'
import * as TranspileFiles from '../TranspileFiles/TranspileFiles.ts'
import * as WriteFile from '../WriteFile/WriteFile.ts'
import * as ExportStaticSite from '../ExportStaticSite/ExportStaticSite.ts'

const main = async () => {
  const indexPath = Path.absolute('packages/build/.tmp/server/shared-process/index.js')
  const indexUri = pathToFileURL(indexPath).toString()
  const module = await import(indexUri)
  const tmpDir = Path.absolute(`packages/build/.tmp/export-test`)
  await Remove.remove(tmpDir)
  await Mkdir.mkdir(tmpDir)
  const extensionPath = join(tmpDir, 'extension')
  const secondExtensionPath = join(tmpDir, 'second-extension')
  const testPath = join(tmpDir, 'e2e')
  await Mkdir.mkdir(join(testPath, 'src'))
  await WriteFile.writeFile({
    to: join(extensionPath, 'extension.json'),
    content: JSON.stringify({
      id: 'test',
      browser: 'dist/main.js',
      icon: 'media/icon.svg',
      rpc: [{ id: 'test.worker', type: 'web-worker', url: 'dist/worker.js' }],
    }),
  })
  await WriteFile.writeFile({ to: join(extensionPath, 'dist', 'main.js'), content: `export {}` })
  await WriteFile.writeFile({ to: join(extensionPath, 'dist', 'worker.js'), content: `export {}` })
  await WriteFile.writeFile({ to: join(extensionPath, 'media', 'icon.svg'), content: `<svg></svg>` })
  await WriteFile.writeFile({
    to: join(secondExtensionPath, 'extension.json'),
    content: JSON.stringify({ id: 'test.second-extension', browser: 'src/main.js' }),
  })
  await WriteFile.writeFile({ to: join(secondExtensionPath, 'src', 'main.js'), content: `export {}` })
  await WriteFile.writeFile({
    to: join(testPath, 'package.json'),
    content: `{}`,
  })
  await WriteFile.writeFile({
    to: join(testPath, 'src', 'sample.test.ts'),
    content: `export const test = async () => {}\n`,
  })
  await Copy.copy({
    from: `packages/build/.tmp/server`,
    to: join(tmpDir, 'node_modules', `@lvce-editor`),
  })
  await Copy.copy({
    from: `packages/shared-process/node_modules/@lvce-editor/verror`,
    to: `packages/build/.tmp/server/shared-process/node_modules/@lvce-editor/verror`,
  })
  let commitHash = ''
  process.env.PATH_PREFIX = '/test'
  try {
    const result = await module.exportStatic({
      extensionPath,
      extensionPaths: [secondExtensionPath],
      testPath,
      root: tmpDir,
    })
    commitHash = result.commitHash
  } catch (error) {
    throw new VError(error, `static export failed`)
  }
  const indexHtml = await ReadFile.readFile(join(tmpDir, 'dist', 'index.html'))
  const chatIndexHtml = await ReadFile.readFile(join(tmpDir, 'dist', 'chat', 'index.html'))
  assert.equal(chatIndexHtml, indexHtml, 'chat route should use the same processed application shell as the root route')
  assert.ok(!indexHtml.includes('startupAppearance'))
  const executableScripts = indexHtml.match(/<script\b[^>]*>/g)?.filter((tag) => !tag.includes('type="application/json"')) || []
  assert.equal(executableScripts.length, 1)
  assert.ok(executableScripts[0].includes('rendererProcessMain.js'))
  assert.ok(executableScripts[0].includes('blocking="render"'))
  assert.equal(executableScripts[0].includes('startupAppearance'), false)
  const configElement = indexHtml.match(/<script id="Config" type="application\/json">([\s\S]*?)<\/script>/)
  assert.ok(configElement, 'static export index.html should include runtime configuration')
  assert.ok(indexHtml.includes('<script id="Config" type="application/json">\n      {\n        "assetDir":'), 'static export runtime configuration should start on an indented new line')
  assert.ok(indexHtml.includes('\n      }\n    </script>'), 'static export runtime configuration should align with its script element')
  assert.ok(configElement[1].includes('\n        "workerUrls": {\n'), 'static export runtime configuration should be formatted across multiple lines')
  const runtimeConfig = JSON.parse(configElement[1])
  assert.equal(runtimeConfig.platform, 'web')
  assert.equal(runtimeConfig.assetDir, `/test/${commitHash}`)
  assert.equal(runtimeConfig.rendererWorkerUrl, `/test/${commitHash}/packages/renderer-worker/dist/rendererWorkerMain.js`)
  assert.ok(Object.values(runtimeConfig.workerUrls as Record<string, string>).every((url) => url.startsWith(`/test/${commitHash}/`)))
  await ReadFile.readFile(join(tmpDir, 'dist', commitHash, 'tests', 'sample.test.html'))
  await ReadFile.readFile(join(tmpDir, 'dist', 'tests', 'sample.test.html'))
  const config = JSON.parse(await ReadFile.readFile(join(tmpDir, 'dist', 'config.json')))
  assert.equal(typeof config.commit, 'string')
  assert.equal(typeof config.productName, 'string')
  assert.equal(typeof config.version, 'string')
  const commitConfig = JSON.parse(await ReadFile.readFile(join(tmpDir, 'dist', commitHash, 'config.json')))
  assert.deepEqual(commitConfig, config)
  const webExtensions = JSON.parse(await ReadFile.readFile(join(tmpDir, 'dist', commitHash, 'config', 'webExtensions.json')))
  const chat2 = webExtensions.find((extension) => extension.id === 'builtin.chat-view-2')
  assert.ok(chat2, 'static export should retain the builtin Chat 2 web extension')
  assert.equal(chat2.path, `/test/${commitHash}/extensions/builtin.chat-view-2`)
  assert.ok(
    webExtensions.some((extension) => extension.id === 'builtin.chat'),
    'static export should retain other builtin web extensions',
  )
  assert.ok(
    webExtensions.some((extension) => extension.id === 'test'),
    'static export should include an added browser extension',
  )
  assert.ok(
    webExtensions.some((extension) => extension.id === 'test.second-extension'),
    'static export should include multiple added browser extensions',
  )
  const chat2Manifest = JSON.parse(await ReadFile.readFile(join(tmpDir, 'dist', commitHash, 'extensions', 'builtin.chat-view-2', 'extension.json')))
  const chat2Assets = [
    chat2Manifest.browser,
    chat2Manifest.icon,
    ...chat2Manifest.rpc.filter((rpc) => rpc.type === 'web-worker').map((rpc) => rpc.url),
    'media/chat.css',
  ]
  for (const asset of chat2Assets) {
    await ReadFile.readFile(join(tmpDir, 'dist', commitHash, 'extensions', 'builtin.chat-view-2', asset))
  }
  await ReadFile.readFile(join(tmpDir, 'dist', commitHash, 'extensions', 'test', 'dist', 'main.js'))
  await ReadFile.readFile(join(tmpDir, 'dist', commitHash, 'extensions', 'test', 'dist', 'worker.js'))
  await ReadFile.readFile(join(tmpDir, 'dist', commitHash, 'extensions', 'test', 'media', 'icon.svg'))
  await ReadFile.readFile(join(tmpDir, 'dist', commitHash, 'extensions', 'test.second-extension', 'src', 'main.js'))
  // Static e2e pages must start without an optional on-load commands file.
  await Remove.remove(join(tmpDir, 'dist', commitHash, 'config', 'onLoadCommands.json'))
  const testOverview = await ReadFile.readFile(join(tmpDir, 'dist', commitHash, 'tests', 'index.html'))
  if (!testOverview.includes('sample.test.html')) {
    throw new Error('static export test overview does not include sample.test.html')
  }

  const pagesRoot = Path.absolute('packages/build/.tmp/export-pages-test')
  process.env.PATH_PREFIX = '/lvce-editor'
  const pagesResult = await ExportStaticSite.exportStaticSite({
    root: pagesRoot,
    serverRoot: Path.absolute('packages/build/.tmp/server'),
  })
  const pagesIndexHtml = await ReadFile.readFile(join(pagesRoot, 'dist', 'index.html'))
  const pagesChatIndexHtml = await ReadFile.readFile(join(pagesRoot, 'dist', 'chat', 'index.html'))
  assert.equal(pagesChatIndexHtml, pagesIndexHtml, 'prefixed chat route should use the same application shell as the root route')
  assert.ok(!pagesIndexHtml.includes('startupAppearance'))
  const pagesExecutableScripts = pagesIndexHtml.match(/<script\b[^>]*>/g)?.filter((tag) => !tag.includes('type="application/json"')) || []
  assert.equal(pagesExecutableScripts.length, 1)
  assert.ok(pagesExecutableScripts[0].includes('rendererProcessMain.js'))
  assert.ok(pagesExecutableScripts[0].includes('blocking="render"'))
  assert.equal(pagesExecutableScripts[0].includes('startupAppearance'), false)
  const pagesConfigElement = pagesIndexHtml.match(/<script id="Config" type="application\/json">([\s\S]*?)<\/script>/)
  assert.ok(pagesConfigElement, 'Pages export index.html should include runtime configuration')
  assert.ok(pagesIndexHtml.includes('<script id="Config" type="application/json">\n      {\n        "assetDir":'), 'Pages runtime configuration should start on an indented new line')
  assert.ok(pagesIndexHtml.includes('\n      }\n    </script>'), 'Pages runtime configuration should align with its script element')
  assert.ok(pagesConfigElement[1].includes('\n        "workerUrls": {\n'), 'Pages export runtime configuration should be formatted across multiple lines')
  const pagesRuntimeConfig = JSON.parse(pagesConfigElement[1])
  assert.equal(pagesRuntimeConfig.platform, 'web')
  assert.equal(pagesRuntimeConfig.assetDir, `/lvce-editor/${pagesResult.commitHash}`)
  assert.equal(pagesRuntimeConfig.rendererWorkerUrl, `/lvce-editor/${pagesResult.commitHash}/packages/renderer-worker/dist/rendererWorkerMain.js`)
  assert.ok(
    Object.values(pagesRuntimeConfig.workerUrls as Record<string, string>).every((url) => url.startsWith(`/lvce-editor/${pagesResult.commitHash}/`)),
  )
  await ReadFile.readFile(join(pagesRoot, 'dist', pagesResult.commitHash, 'packages/renderer-worker/dist/rendererWorkerMain.js'))
  await ReadFile.readFile(join(pagesRoot, 'dist', pagesResult.commitHash, 'css', 'App.css'))
  const pagesManifest = JSON.parse(await ReadFile.readFile(join(pagesRoot, 'dist', pagesResult.commitHash, 'manifest.json')))
  assert.equal(pagesManifest.start_url, '/lvce-editor/')
  assert.equal(pagesManifest.scope, '/lvce-editor/')
  assert.equal(pagesManifest.display, 'standalone')
  assert.deepEqual(
    pagesManifest.icons.map(({ src }) => src),
    [`/lvce-editor/${pagesResult.commitHash}/icons/pwa-icon-192.png`, `/lvce-editor/${pagesResult.commitHash}/icons/pwa-icon-512.png`],
  )
  await ReadFile.readFile(join(pagesRoot, 'dist', pagesResult.commitHash, 'icons', 'pwa-icon-192.png'))
  await ReadFile.readFile(join(pagesRoot, 'dist', pagesResult.commitHash, 'icons', 'pwa-icon-512.png'))
  await ReadFile.readFile(join(pagesRoot, 'dist', pagesResult.commitHash, 'icons', 'extensionDefaultIcon.png'))
  await ReadFile.readFile(join(pagesRoot, 'dist', pagesResult.commitHash, 'config', 'onLoadCommands.json'))
  const pagesWebExtensions = JSON.parse(await ReadFile.readFile(join(pagesRoot, 'dist', pagesResult.commitHash, 'config', 'webExtensions.json')))
  const pagesChat2 = pagesWebExtensions.find((extension) => extension.id === 'builtin.chat-view-2')
  assert.ok(pagesChat2, 'Pages export should retain the builtin Chat 2 web extension')
  assert.equal(pagesChat2.path, `/lvce-editor/${pagesResult.commitHash}/extensions/builtin.chat-view-2`)
  await ReadFile.readFile(join(pagesRoot, 'dist', pagesResult.commitHash, 'extensions', 'builtin.chat-view-2', 'dist', 'chatMain.js'))
  assert.equal(existsSync(join(pagesRoot, 'dist', 'tests')), false, 'Pages export should not include test pages')
  assert.equal(existsSync(join(pagesRoot, 'dist', pagesResult.commitHash, 'tests')), false, 'Pages export should not include test assets')

  delete process.env.PATH_PREFIX
  const rootPrefix = Path.absolute('packages/build/.tmp/export-root-prefix-test')
  const rootPrefixResult = await ExportStaticSite.exportStaticSite({
    root: rootPrefix,
    serverRoot: Path.absolute('packages/build/.tmp/server'),
  })
  const rootWebExtensions = JSON.parse(await ReadFile.readFile(join(rootPrefix, 'dist', rootPrefixResult.commitHash, 'config', 'webExtensions.json')))
  const rootIndexHtml = await ReadFile.readFile(join(rootPrefix, 'dist', 'index.html'))
  const rootChatIndexHtml = await ReadFile.readFile(join(rootPrefix, 'dist', 'chat', 'index.html'))
  assert.equal(rootChatIndexHtml, rootIndexHtml, 'root chat route should use the same application shell as the root route')
  const rootChat2 = rootWebExtensions.find((extension) => extension.id === 'builtin.chat-view-2')
  assert.ok(rootChat2, 'root export should retain the builtin Chat 2 web extension')
  assert.equal(rootChat2.path, `/${rootPrefixResult.commitHash}/extensions/builtin.chat-view-2`)
  await ReadFile.readFile(join(rootPrefix, 'dist', rootPrefixResult.commitHash, 'extensions', 'builtin.chat-view-2', 'dist', 'chatMain.js'))
  await Remove.remove(`packages/build/.tmp/server/shared_process/node_modules`)

  const testFiles = await ReadDir.readDir('packages/extension-host-worker-tests/src')
  const filteredDirents = testFiles.filter((dirent) => !dirent.startsWith('_'))
  for (const dirent of filteredDirents) {
    const name = dirent.slice(0, -3)
    await Copy.copyFile({
      from: `packages/build/.tmp/export-test/dist/index.html`,
      to: `packages/build/.tmp/export-test/dist/tests/${name}.html`,
    })
    await Copy.copyFile({
      from: `packages/extension-host-worker-tests/src/${dirent}`,
      to: `packages/build/.tmp/export-test/dist/${commitHash}/packages/extension-host-worker-tests/src/${dirent}`,
    })
  }
  await TranspileFiles.transpileFiles(Path.absolute(`packages/build/.tmp/export-test/dist/${commitHash}/packages/extension-host-worker-tests/src`))
  if (existsSync(Path.absolute('packages/extension-host-worker-tests/fixtures'))) {
    await Copy.copy({
      from: `packages/extension-host-worker-tests/fixtures`,
      to: `packages/build/.tmp/export-test/dist/${commitHash}/packages/extension-host-worker-tests/fixtures`,
    })
  }
}

main()
