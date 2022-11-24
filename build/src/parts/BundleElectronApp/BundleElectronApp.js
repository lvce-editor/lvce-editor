import { existsSync } from 'node:fs'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleExtensionHostWorkerCached from '../BundleExtensionHostWorkerCached/BundleExtensionHostWorkerCached.js'
import * as BundleRendererProcessCached from '../BundleRendererProcessCached/BundleRendererProcessCached.js'
import * as BundleRendererWorkerCached from '../BundleRendererWorkerCached/BundleRendererWorkerCached.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Copy from '../Copy/Copy.js'
import * as GetElectronVersion from '../GetElectronVersion/GetElectronVersion.js'
import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Product from '../Product/Product.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Remove from '../Remove/Remove.js'
import * as Rename from '../Rename/Rename.js'
import * as Replace from '../Replace/Replace.js'
import * as Root from '../Root/Root.js'
import * as Tag from '../Tag/Tag.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const getDependencyCacheHash = async ({ electronVersion, arch }) => {
  const files = [
    'packages/main-process/package-lock.json',
    'packages/shared-process/package-lock.json',
    'packages/pty-host/package-lock.json',
    'packages/extension-host/package-lock.json',
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
    'build/src/parts/Rebuild/Rebuild.js',
  ]
  const absolutePaths = files.map(Path.absolute)
  const contents = await Promise.all(absolutePaths.map(ReadFile.readFile))
  const hash = Hash.computeHash(contents + electronVersion + arch)
  return hash
}

const downloadElectron = async ({ platform, arch, electronVersion }) => {
  const outDir = Path.join(
    Root.root,
    'build',
    '.tmp',
    'electron',
    electronVersion
  )
  const DownloadElectron = await import(
    '../DownloadElectron/DownloadElectron.js'
  )
  await DownloadElectron.downloadElectron({
    electronVersion,
    outDir,
    platform,
    arch,
  })
}

const copyElectron = async ({
  arch,
  electronVersion,
  useInstalledElectronVersion,
}) => {
  const outDir = useInstalledElectronVersion
    ? Path.join(
        Root.root,
        'packages',
        'main-process',
        'node_modules',
        'electron',
        'dist'
      )
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
    occurrence: `applicationName = 'lvce-oss'`,
    replacement: `applicationName = '${Product.applicationName}'`,
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
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/shared-process/src/parts/Platform/Platform.js`,
    occurrence: `export const getExtensionHostHelperProcessPath = async () => {
  const { extensionHostHelperProcessPath } = await import(
    '@lvce-editor/extension-host-helper-process'
  )
  return extensionHostHelperProcessPath
}`,
    replacement: `export const getExtensionHostHelperProcessPath = () => {
  return Path.join(Root.root, 'packages', 'extension-host-helper-process', 'src', 'extensionHostHelperProcessMain.js')
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

const copyMainProcessSources = async ({ arch, commitHash }) => {
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
    occurrence: `exports.isProduction = false`,
    replacement: `exports.isProduction = true`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.applicationName = 'lvce-oss'`,
    replacement: `exports.applicationName = '${Product.applicationName}'`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.isLinux = process.platform === 'linux'`,
    replacement: `exports.isLinux = ${Platform.isLinux()}`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.isWindows = process.platform === 'win32'`,
    replacement: `exports.isWindows = ${Platform.isWindows()}`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.isMacOs = process.platform === 'darwin'`,
    replacement: `exports.isMacOs = ${Platform.isMacos()}`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.scheme = 'lvce-oss'`,
    replacement: `exports.scheme = '${Product.applicationName}'`,
  })
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.commit = 'unknown commit'`,
    replacement: `exports.commit = '${commitHash}'`,
  })
  const version = await Tag.getGitTag()
  await Replace.replace({
    path: `build/.tmp/electron-bundle/${arch}/resources/app/packages/main-process/src/parts/Platform/Platform.js`,
    occurrence: `exports.version = '0.0.0-dev'`,
    replacement: `exports.version = '${version}'`,
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

const copyExtensionHostHelperProcessSources = async ({ arch }) => {
  await Copy.copy({
    from: 'packages/extension-host-helper-process/src',
    to: `build/.tmp/electron-bundle/${arch}/resources/app/packages/extension-host-helper-process/src`,
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
    outDir: `build/.tmp/electron-bundle/${arch}/resources/app/static/css`,
  })
}

export const build = async () => {
  const arch = process.arch
  const useInstalledElectronVersion = process.argv.includes(
    '--use-installed-electron-version'
  )
  const electronVersion = await GetElectronVersion.getElectronVersion()
  const dependencyCacheHash = await getDependencyCacheHash({
    electronVersion,
    arch,
  })
  const dependencyCachePath = Path.join(
    Path.absolute('build/.tmp/cachedDependencies'),
    dependencyCacheHash
  )
  const dependencyCachePathFinished = Path.join(dependencyCachePath, 'finished')
  const commitHash = await CommitHash.getCommitHash()

  if (
    existsSync(dependencyCachePath) &&
    existsSync(dependencyCachePathFinished)
  ) {
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
      electronVersion,
    })
    console.timeEnd('bundleElectronAppDependencies')
  }

  if (!useInstalledElectronVersion) {
    console.time('downloadElectron')
    await downloadElectron({
      arch,
      electronVersion,
      platform: process.platform,
    })
    console.timeEnd('downloadElectron')
  }

  console.time('copyElectron')
  await copyElectron({
    arch,
    electronVersion,
    useInstalledElectronVersion,
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
  await copyMainProcessSources({ arch, commitHash })
  console.timeEnd('copyMainProcessSources')

  console.time('copySharedProcessSources')
  await copySharedProcessSources({ arch })
  console.timeEnd('copySharedProcessSources')

  console.time('copyExtensionHostHelperProcessSources')
  await copyExtensionHostHelperProcessSources({ arch })
  console.timeEnd('copyExtensionHostHelperProcessSources')

  console.time('copyExtensions')
  await copyExtensions({ arch })
  console.timeEnd('copyExtensions')

  console.time('copyStaticFiles')
  await copyStaticFiles({ arch })
  console.timeEnd('copyStaticFiles')

  console.time('copyCss')
  await copyCss({ arch })
  console.timeEnd('copyCss')

  const rendererProcessCachePath =
    await BundleRendererProcessCached.bundleRendererProcessCached({
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

  const rendererWorkerCachePath =
    await BundleRendererWorkerCached.bundleRendererWorkerCached({
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
  const extensionHostWorkerCachePath =
    await BundleExtensionHostWorkerCached.bundleExtensionHostWorkerCached({
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

  console.time('copyPlaygroundFiles')
  await copyPlaygroundFiles({ arch })
  console.timeEnd('copyPlaygroundFiles')

  await WriteFile.writeFile({
    to: dependencyCachePathFinished,
    content: '1',
  })
}
