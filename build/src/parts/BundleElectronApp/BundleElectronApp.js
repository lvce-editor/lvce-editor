import { existsSync } from 'fs'
import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Copy from '../Copy/Copy.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'
import * as Product from '../Product/Product.js'
import * as Platform from '../Platform/Platform.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleJs from '../BundleJs/BundleJs.js'
import * as BundleRendererProcess from '../BundleRendererProcess/BundleRendererProcess.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import * as Rename from '../Rename/Rename.js'

const getDependencyCacheHash = async () => {
  const files = [
    'packages/main-process/package-lock.json',
    'packages/shared-process/package-lock.json',
    'packages/pty-host/package-lock.json',
    'packages/extension-host/package-lock.json',
    'build/src/parts/BundleElectronApp/BundleElectronApp.js',
    'build/src/parts/BundleElectronAppDependencies/BundleElectronAppDependencies.js',
    'build/src/parts/BundleExtensionHostDependencies/BundleExtensionHostDependencies.js',
    'build/src/parts/BundleSharedProcessDependencies/BundleSharedProcessDependencies.js',
    'build/src/parts/BundlePtyHostDependencies/BundlePtyHostDependencies.js',
    'build/src/parts/BundleMainProcessDependencies/BundleMainProcessDependencies.js',
    'build/src/parts/NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js',
    'build/src/parts/NpmDependencies/NpmDependencies.js',
  ]
  const absolutePaths = files.map(Path.absolute)
  const contents = await Promise.all(absolutePaths.map(ReadFile.readFile))
  const hash = Hash.computeHash(contents)
  return hash
}

const copyElectron = async ({ arch }) => {
  const electronPath = `packages/main-process/node_modules/electron/dist`
  await Copy.copy({
    from: electronPath,
    to: `build/.tmp/electron-bundle/${arch}`,
    ignore: [
      // TODO still include en locale, but exclude other locales
      // 'locales',
      'chrome_crashpad_handler',
      'resources',
    ],
  })

  if (Platform.isWindows()) {
    await Rename.rename({
      from: `build/.tmp/electron-bundle/${arch}/electron.exe`,
      to: `build/.tmp/electron-bundle/${arch}/${Product.applicationName}.exe`,
    })
  } else if (Platform.isMacos()) {
    await Rename.rename({
      from: `build/.tmp/electron-bundle/${arch}/Electron.app`,
      to: `build/.tmp/electron-bundle/${arch}/${Product.applicationName}.app`,
    })
  } else {
    await Rename.rename({
      from: `build/.tmp/electron-bundle/${arch}/electron`,
      to: `build/.tmp/electron-bundle/${arch}/${Product.applicationName}`,
    })
  }
}

const copyDependencies = async ({ cachePath, arch }) => {
  await Copy.copy({
    from: cachePath,
    to: `build/.tmp/electron-bundle/${arch}/resources/app`,
  })
}

const copySharedProcessSources = async ({ arch }) => {
  await Copy.copy({
    from: 'packages/shared-process/src',
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/shared-process/src`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/shared-process/src/parts/Platform/Platform.js`,
    occurrence: `getApplicationName() {
  return 'lvce-oss'
}`,
    replacement: `getApplicationName() {
  return '${Product.applicationName}'
}`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/shared-process/src/parts/Platform/Platform.js`,
    occurrence: `import { extensionHostPath } from '@lvce-editor/extension-host'\n`,
    replacement: '',
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/shared-process/src/parts/Platform/Platform.js`,
    occurrence: `export const getExtensionHostPath = () => {
  return extensionHostPath
}`,
    replacement: `export const getExtensionHostPath = () => {
  return Path.join(Root.root, 'packages', 'extension-host', 'src', 'extensionHostMain.js')
}`,
  })
}

const copyPlaygroundFiles = async ({ arch }) => {
  await WriteFile.writeFile({
    to: `build/.tmp/electron-bundle/${arch}/resources/app/playground/index.html`,
    content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="index.css" />
    <title>Document</title>
  </head>
  <body>
    <h1>hello world</h1>
  </body>
</html>
`,
  })
  await WriteFile.writeFile({
    to: `build/.tmp/electron-bundle/${arch}/resources/app/playground/index.css`,
    content: `h1 { color: dodgerblue; }`,
  })
}

const copyMainProcessSources = async ({ arch }) => {
  await Copy.copy({
    from: 'packages/main-process/src',
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src`,
  })
  await Copy.copy({
    from: `packages/main-process/pages`,
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/pages`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.isProduction = () => {
  return false
}`,
    replacement: `exports.isProduction = () => {
  return true
}`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.getApplicationName = () => {
  return 'lvce-oss'
}`,
    replacement: `exports.getApplicationName = () => {
  return '${Product.nameLong}'
}`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.isLinux = () => {
  return process.platform === 'linux'
}`,
    replacement: `exports.isLinux = () => {
  return ${Platform.isLinux()}
}`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.isWindows = () => {
  return process.platform === 'win32'
}`,
    replacement: `exports.isWindows = () => {
  return ${Platform.isWindows()}
}`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.isMacOs = () => {
  return process.platform === 'darwin'
}`,
    replacement: `exports.isMacOs = () => {
  return ${Platform.isMacos()}
}`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.getScheme = () => {
  return 'lvce-oss'
}`,
    replacement: `exports.getScheme = () => {
  return '${Product.applicationName}'
}`,
  })
  const commitHash = await CommitHash.getCommitHash()
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.getCommit = () => {
  return 'unknown commit'
}`,
    replacement: `exports.getCommit = () => {
  return '${commitHash}'
}`,
  })
}

const copyPtyHostSources = async ({ arch }) => {
  await Copy.copy({
    from: 'packages/pty-host/src',
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/pty-host/src`,
  })
}

const copyExtensionHostSources = async ({ arch }) => {
  await Copy.copy({
    from: 'packages/extension-host/src',
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/extension-host/src`,
  })
}

const copyExtensions = async ({ arch }) => {
  await Copy.copy({
    from: 'extensions',
    to: `build/.tmp/electron-bundle/${arch}/resources/app/extensions`,
  })
}

const copyStaticFiles = async ({ arch }) => {
  await Copy.copy({
    from: 'static',
    to: `build/.tmp/electron-bundle/${arch}/resources/app/static`,
    ignore: ['css', 'js'],
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/static/index-electron.html`,
    occurrence: 'packages/renderer-process/src/rendererProcessMain.js',
    replacement: `packages/renderer-process/dist/rendererProcessMain.js`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/static/index-electron.html`,
    occurrence: 'packages/renderer-worker/src/rendererWorkerMain.js',
    replacement: `packages/renderer-worker/dist/rendererWorkerMain.js`,
  })
  // await
}

const copyCss = async ({ arch }) => {
  await BundleCss.bundleCss({
    to: `build/.tmp/electron-bundle/${arch}/resources/app/static/css/App.css`,
  })
}

const getRendererProcessCacheHash = async () => {
  const hash = await Hash.computeFolderHash('packages/renderer-process/src', [
    'build/src/parts/BundleElectronApp/BundleElectronApp.js',
    'build/src/parts/BundleJs/BundleJs.js',
    'build/src/parts/BundleRendererProcess/BundleRendererProcess.js',
  ])
  return hash
}

const getRendererWorkerCacheHash = async () => {
  const hash = await Hash.computeFolderHash('packages/renderer-worker/src', [
    'build/src/parts/BundleElectronApp/BundleElectronApp.js',
    'build/src/parts/BundleJs/BundleJs.js',
    'build/src/parts/BundleRendererWorker/BundleRendererWorker.js',
  ])
  return hash
}

export const build = async () => {
  const arch = process.arch
  const dependencyCacheHash = await getDependencyCacheHash()
  const dependencyCachePath = Path.join(
    Path.absolute('build/.tmp/cachedDependencies'),
    dependencyCacheHash
  )
  const commitHash = await CommitHash.getCommitHash()

  if (existsSync(dependencyCachePath)) {
    console.info('[build step skipped] bundleElectronAppDependencies')
  } else {
    console.time('bundleElectronAppDependencies')
    await Remove.remove(Path.absolute('build/.tmp/cachedDependencies'))
    const BundleElectronAppDependencies = await import(
      '../BundleElectronAppDependencies/BundleElectronAppDependencies.js'
    )
    await BundleElectronAppDependencies.bundleElectronAppDependencies({
      cachePath: dependencyCachePath,
      arch,
    })
    console.timeEnd('bundleElectronAppDependencies')
  }

  console.time('copyElectron')
  await copyElectron({
    arch,
  })
  console.timeEnd('copyElectron')

  console.time('copyDependencies')
  await copyDependencies({
    cachePath: dependencyCachePath,
    arch,
  })
  console.timeEnd('copyDependencies')

  console.time('copyExtensionHostSources')
  await copyExtensionHostSources({ arch })
  console.timeEnd('copyExtensionHostSources')

  console.time('copyPtyHostSources')
  await copyPtyHostSources({ arch })
  console.timeEnd('copyPtyHostSources')

  console.time('copyMainProcessSources')
  await copyMainProcessSources({ arch })
  console.timeEnd('copyMainProcessSources')

  console.time('copySharedProcessSources')
  await copySharedProcessSources({ arch })
  console.timeEnd('copySharedProcessSources')

  console.time('copyExtensions')
  await copyExtensions({ arch })
  console.timeEnd('copyExtensions')

  console.time('copyStaticFiles')
  await copyStaticFiles({ arch })
  console.timeEnd('copyStaticFiles')

  console.time('copyCss')
  await copyCss({ arch })
  console.timeEnd('copyCss')

  const rendererProcessCacheHash = await getRendererProcessCacheHash()
  const rendererProcessCachePath = Path.join(
    Path.absolute('build/.tmp/cachedSources/renderer-process'),
    rendererProcessCacheHash
  )

  if (existsSync(rendererProcessCachePath)) {
    console.info('[build step skipped] bundleRendererProcess')
  } else {
    console.time('bundleRendererProcess')
    await Remove.remove(
      Path.absolute('build/.tmp/cachedSources/renderer-process')
    )
    const BundleRendererProcess = await import(
      '../BundleRendererProcess/BundleRendererProcess.js'
    )
    await BundleRendererProcess.bundleRendererProcess({
      cachePath: rendererProcessCachePath,
      arch,
      commitHash,
    })
    console.timeEnd('bundleRendererProcess')
  }

  console.time('copyRendererProcessFiles')
  await Copy.copy({
    from: rendererProcessCachePath,
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/renderer-process`,
    ignore: ['static'],
  })
  console.timeEnd('copyRendererProcessFiles')

  const rendererWorkerCacheHash = await getRendererWorkerCacheHash()
  const rendererWorkerCachePath = Path.join(
    Path.absolute('build/.tmp/cachedSources/renderer-worker'),
    rendererWorkerCacheHash
  )

  if (existsSync(rendererWorkerCachePath)) {
    console.info('[build step skipped] bundleRendererWorker')
  } else {
    console.time('bundleRendererWorker')
    await Remove.remove(
      Path.absolute('build/.tmp/cachedSources/renderer-worker')
    )
    const BundleRendererWorker = await import(
      '../BundleRendererWorker/BundleRendererWorker.js'
    )
    await BundleRendererWorker.bundleRendererWorker({
      cachePath: rendererWorkerCachePath,
      arch,
    })
    console.timeEnd('bundleRendererWorker')
  }

  console.time('copyRendererWorkerFiles')
  await Copy.copy({
    from: rendererWorkerCachePath,
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/renderer-worker`,
    ignore: ['static'],
  })
  console.timeEnd('copyRendererWorkerFiles')

  console.time('copyPlaygroundFiles')
  await copyPlaygroundFiles({ arch })
  console.timeEnd('copyPlaygroundFiles')
}
