import { existsSync } from 'node:fs'
import * as Assert from '../Assert/Assert.js'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleExtensionHostSubWorkerCached from '../BundleExtensionHostSubWorkerCached/BundleExtensionHostSubWorkerCached.js'
import * as BundleExtensionHostWorkerCached from '../BundleExtensionHostWorkerCached/BundleExtensionHostWorkerCached.js'
import * as BundleMainProcessCached from '../BundleMainProcessCached/BundleMainProcessCached.js'
import * as BundleOptions from '../BundleOptions/BundleOptions.js'
import * as BundleRendererProcessCached from '../BundleRendererProcessCached/BundleRendererProcessCached.js'
import * as BundleRendererWorkerCached from '../BundleRendererWorkerCached/BundleRendererWorkerCached.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Copy from '../Copy/Copy.js'
import * as CopySharedProcessSources from '../CopySharedProcessSources/CopySharedProcessSources.js'
import * as GetCommitDate from '../GetCommitDate/GetCommitDate.js'
import * as GetElectronVersion from '../GetElectronVersion/GetElectronVersion.js'
import * as Hash from '../Hash/Hash.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as ReadDir from '../ReadDir/ReadDir.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Remove from '../Remove/Remove.js'
import * as Rename from '../Rename/Rename.js'
import * as Replace from '../Replace/Replace.js'
import * as Root from '../Root/Root.js'
import * as Tag from '../Tag/Tag.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const getDependencyCacheHash = async ({ electronVersion, arch, supportsAutoUpdate }) => {
  const files = [
    'packages/main-process/package-lock.json',
    'packages/shared-process/package-lock.json',
    'packages/pty-host/package-lock.json',
    'packages/extension-host/package-lock.json',
    'packages/extension-host-worker/package-lock.json',
    'packages/extension-host-sub-worker/package-lock.json',
    'packages/extension-host-helper-process/package-lock.json',
    'build/src/parts/BundleElectronApp/BundleElectronApp.js',
    'build/src/parts/BundleElectronAppDependencies/BundleElectronAppDependencies.js',
    'build/src/parts/BundleExtensionHostDependencies/BundleExtensionHostDependencies.js',
    'build/src/parts/BundleExtensionHostHelperProcessDependencies/BundleExtensionHostHelperProcessDependencies.js',
    'build/src/parts/BundleSharedProcessDependencies/BundleSharedProcessDependencies.js',
    'build/src/parts/BundlePtyHostDependencies/BundlePtyHostDependencies.js',
    'build/src/parts/BundleMainProcessDependencies/BundleMainProcessDependencies.js',
    'build/src/parts/NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js',
    'build/src/parts/NpmDependencies/NpmDependencies.js',
    'build/src/parts/WalkDependencies/WalkDependencies.js',
    'build/src/parts/Rebuild/Rebuild.js',
  ]
  const absolutePaths = files.map(Path.absolute)
  const contents = await Promise.all(absolutePaths.map(ReadFile.readFile))
  const hash = Hash.computeHash(contents + electronVersion + arch + String(supportsAutoUpdate))
  return hash
}

const downloadElectron = async ({ platform, arch, electronVersion }) => {
  const outDir = Path.join(Root.root, 'build', '.tmp', 'electron', electronVersion)
  const DownloadElectron = await import('../DownloadElectron/DownloadElectron.js')
  await DownloadElectron.downloadElectron({
    electronVersion,
    outDir,
    platform,
    arch,
  })
}

const copyElectron = async ({ arch, electronVersion, useInstalledElectronVersion, product }) => {
  const outDir = useInstalledElectronVersion
    ? Path.join(Root.root, 'packages', 'main-process', 'node_modules', 'electron', 'dist')
    : Path.join(Root.root, 'build', '.tmp', 'electron', electronVersion)
  await Copy.copy({
    from: outDir,
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
      to: `build/.tmp/electron-bundle/${arch}/${product.windowsExecutableName}.exe`,
    })
  } else if (Platform.isMacos()) {
    await Rename.rename({
      from: `build/.tmp/electron-bundle/${arch}/Electron.app`,
      to: `build/.tmp/electron-bundle/${arch}/${product.applicationName}.app`,
    })
  } else {
    await Rename.rename({
      from: `build/.tmp/electron-bundle/${arch}/electron`,
      to: `build/.tmp/electron-bundle/${arch}/${product.applicationName}`,
    })
  }
}

const shouldLocaleBeRemoved = (locale) => {
  return locale !== 'en-US.pak'
}

const removeUnusedLocales = async ({ arch }) => {
  const localesPath = `build/.tmp/electron-bundle/${arch}/locales`
  const dirents = await ReadDir.readDir(localesPath)
  const toRemove = dirents.filter(shouldLocaleBeRemoved)
  for (const dirent of toRemove) {
    await Remove.remove(`build/.tmp/electron-bundle/${arch}/locales/${dirent}`)
  }
}

const copyDependencies = async ({ cachePath, arch }) => {
  await Copy.copy({
    from: cachePath,
    to: `build/.tmp/electron-bundle/${arch}/resources/app`,
  })
}

const copySharedProcessSources = async ({ arch, product, commitHash, version, date }) => {
  await CopySharedProcessSources.copySharedProcessSources({
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/shared-process`,
    product,
    commitHash,
    version,
    date,
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

const copyMainProcessSources = async ({ arch, commitHash, product, version }) => {}

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

const copyExtensionHostHelperProcessSources = async ({ arch }) => {
  await Copy.copy({
    from: 'packages/extension-host-helper-process/src',
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/extension-host-helper-process/src`,
  })
}

const copyPdfWorkerSources = async ({ arch }) => {
  await Copy.copy({
    from: 'packages/pdf-worker/src',
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/pdf-worker/src`,
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
    path: `build/.tmp/electron-bundle/${arch}/resources/app/static/index.html`,
    occurrence: 'packages/renderer-process/src/rendererProcessMain.js',
    replacement: `packages/renderer-process/dist/rendererProcessMain.js`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/static/index.html`,
    occurrence: '\n    <link rel="manifest" href="/manifest.json" />',
    replacement: ``,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/static/index.html`,
    occurrence: '\n    <link rel="apple-touch-icon" href="/icons/pwa-icon-192.png" />',
    replacement: ``,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/static/index.html`,
    occurrence: '\n    <meta name="theme-color" content="#282e2f" />',
    replacement: ``,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/static/index.html`,
    occurrence: '\n    <meta name="description" content="Online Code Editor" />',
    replacement: ``,
  })
}

const copyCss = async ({ arch }) => {
  await BundleCss.bundleCss({
    outDir: `build/.tmp/electron-bundle/${arch}/resources/app/static/css`,
  })
}

const addRootPackageJson = async ({ cachePath, electronVersion, product, bundleMainProcess, version }) => {
  const main = bundleMainProcess ? 'packages/main-process/dist/mainProcessMain.js' : 'packages/main-process/src/mainProcessMain.js'
  await JsonFile.writeJson({
    to: `${cachePath}/package.json`,
    value: {
      name: product.applicationName,
      productName: product.nameLong,
      version: version,
      electronVersion,
      main,
    },
  })
}

export const build = async ({ product, version = '0.0.0-dev', supportsAutoUpdate = false, shouldRemoveUnusedLocales = false }) => {
  Assert.object(product)
  Assert.string(version)
  const arch = process.arch
  const { electronVersion, isInstalled } = await GetElectronVersion.getElectronVersion()
  const dependencyCacheHash = await getDependencyCacheHash({
    electronVersion,
    arch,
    supportsAutoUpdate,
  })
  const dependencyCachePath = Path.join(Path.absolute('build/.tmp/cachedDependencies'), dependencyCacheHash)
  const dependencyCachePathFinished = Path.join(dependencyCachePath, 'finished')
  const commitHash = await CommitHash.getCommitHash()
  const date = GetCommitDate.getCommitDate(commitHash)
  const bundleMainProcess = BundleOptions.bundleMainProcess

  if (!isInstalled) {
    console.time('downloadElectron')
    await downloadElectron({
      arch,
      electronVersion,
      platform: process.platform,
    })
    console.timeEnd('downloadElectron')
  }

  if (existsSync(dependencyCachePath) && existsSync(dependencyCachePathFinished)) {
    Logger.info('[build step skipped] bundleElectronAppDependencies')
  } else {
    console.time('bundleElectronAppDependencies')
    await Remove.remove(Path.absolute('build/.tmp/cachedDependencies'))
    const BundleElectronAppDependencies = await import('../BundleElectronAppDependencies/BundleElectronAppDependencies.js')
    await BundleElectronAppDependencies.bundleElectronAppDependencies({
      cachePath: dependencyCachePath,
      arch,
      electronVersion,
      product,
      supportsAutoUpdate,
    })
    console.timeEnd('bundleElectronAppDependencies')
  }

  console.time('copyElectron')
  await copyElectron({
    arch,
    electronVersion,
    useInstalledElectronVersion: isInstalled,
    product,
  })
  console.timeEnd('copyElectron')

  if (shouldRemoveUnusedLocales) {
    console.time('removeUnusedLocales')
    await removeUnusedLocales({ arch })
    console.timeEnd('removeUnusedLocales')
  }

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

  const mainProcessCachePath = await BundleMainProcessCached.bundleMainProcessCached({
    commitHash,
    product,
    version,
    bundleMainProcess,
  })

  console.time('copyMainProcessFiles')
  await Copy.copy({
    from: mainProcessCachePath,
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process`,
  })
  console.timeEnd('copyMainProcessFiles')

  console.time('copyMainProcessSources')
  await copyMainProcessSources({ arch, commitHash, product, version })
  console.timeEnd('copyMainProcessSources')

  console.time('copySharedProcessSources')
  await copySharedProcessSources({ arch, commitHash, product, version, date })
  console.timeEnd('copySharedProcessSources')

  console.time('copyExtensionHostHelperProcessSources')
  await copyExtensionHostHelperProcessSources({ arch })
  console.timeEnd('copyExtensionHostHelperProcessSources')

  console.time('copyPdfWorkerSources')
  await copyPdfWorkerSources({ arch })
  console.timeEnd('copyPdfWorkerSources')

  console.time('copyExtensions')
  await copyExtensions({ arch })
  console.timeEnd('copyExtensions')

  console.time('copyStaticFiles')
  await copyStaticFiles({ arch })
  console.timeEnd('copyStaticFiles')

  console.time('copyCss')
  await copyCss({ arch })
  console.timeEnd('copyCss')

  const rendererProcessCachePath = await BundleRendererProcessCached.bundleRendererProcessCached({
    commitHash,
    platform: 'electron',
    assetDir: `../../../../..`,
  })

  console.time('copyRendererProcessFiles')
  await Copy.copy({
    from: rendererProcessCachePath,
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/renderer-process`,
    ignore: ['static'],
  })
  console.timeEnd('copyRendererProcessFiles')

  const rendererWorkerCachePath = await BundleRendererWorkerCached.bundleRendererWorkerCached({
    commitHash,
    platform: 'electron',
    assetDir: `../../../../..`,
  })

  console.time('copyRendererWorkerFiles')
  await Copy.copy({
    from: rendererWorkerCachePath,
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/renderer-worker`,
    ignore: ['static'],
  })
  console.timeEnd('copyRendererWorkerFiles')
  const extensionHostWorkerCachePath = await BundleExtensionHostWorkerCached.bundleExtensionHostWorkerCached({
    commitHash,
    platform: 'electron',
    assetDir: `../../../../..`,
  })

  console.time('copyExtensionHostWorkerFiles')
  await Copy.copy({
    from: extensionHostWorkerCachePath,
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/extension-host-worker`,
    ignore: ['static'],
  })
  console.timeEnd('copyExtensionHostWorkerFiles')

  const extensionHostSubWorkerCachePath = await BundleExtensionHostSubWorkerCached.bundleExtensionHostSubWorkerCached({
    commitHash,
    platform: 'electron',
    assetDir: `../../../../..`,
  })

  console.time('copyExtensionHostSubWorkerFiles')
  await Copy.copy({
    from: extensionHostSubWorkerCachePath,
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/extension-host-sub-worker`,
    ignore: ['static'],
  })
  console.timeEnd('copyExtensionHostSubWorkerFiles')

  console.time('copyPlaygroundFiles')
  await copyPlaygroundFiles({ arch })
  console.timeEnd('copyPlaygroundFiles')

  console.time('addRootPackageJson')
  await addRootPackageJson({
    electronVersion,
    product,
    cachePath: Path.absolute(`build/.tmp/electron-bundle/${arch}/resources/app`),
    bundleMainProcess,
    version,
  })
  console.timeEnd('addRootPackageJson')

  await WriteFile.writeFile({
    to: dependencyCachePathFinished,
    content: '1',
  })
}
