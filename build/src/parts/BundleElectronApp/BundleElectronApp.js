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

  // if (Platform.isWindows()) {
  //   await Rename.rename({
  //     from: `build/.tmp/bundle/electron-result/electron.exe`,
  //     to: `build/.tmp/bundle/electron-result/${Product.applicationName}.exe`,
  //   })
  // } else if (Platform.isMacos()) {
  //   await Rename.rename({
  //     from: `build/.tmp/bundle/electron-result/Electron.app`,
  //     to: `build/.tmp/bundle/electron-result/${Product.applicationName}.app`,
  //   })
  // } else {
  //   await Rename.rename({
  //     from: `build/.tmp/bundle/electron-result/electron`,
  //     to: `build/.tmp/bundle/electron-result/${Product.applicationName}`,
  //   })
  // }
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
    ignore: ['css'],
  })
}

export const build = async () => {
  const arch = process.arch
  const cacheHash = await getDependencyCacheHash()

  const cachePath = Path.join(
    Path.absolute('build/.tmp/cachedDependencies'),
    cacheHash
  )

  if (existsSync(cachePath)) {
    console.info('[build step skipped] bundleElectronAppDependencies')
  } else {
    console.time('bundleElectronAppDependencies')
    await Remove.remove(Path.absolute('build/.tmp/cachedDependencies'))
    const BundleElectronAppDependencies = await import(
      '../BundleElectronAppDependencies/BundleElectronAppDependencies.js'
    )
    await BundleElectronAppDependencies.bundleElectronAppDependencies({
      cachePath,
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
    cachePath,
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

  // const electronVersion = await getElectronVersion()
  // console.time('copyPtyHostFiles')
  // await copyPtyHostFiles({
  //   arch,
  //   electronVersion,
  //   cache,
  // })
  // console.timeEnd('copyPtyHostFiles')

  // console.time('copyExtensionHostFiles')
  // await copyExtensionHostFiles({
  //   cache,
  // })
  // console.timeEnd('copyExtensionHostFiles')

  // console.time('copySharedProcessFiles')
  // await copySharedProcessFiles({
  //   cache,
  // })
  // console.timeEnd('copySharedProcessFiles')

  // console.time('copyMainProcessFiles')
  // await copyMainProcessFiles({
  //   cache,
  // })
  // console.timeEnd('copyMainProcessFiles')

  // console.time('copyCode')
  // await copyCode()
  // console.timeEnd('copyCode')

  // console.time('copyCode')
  // await copyCode()
  // console.timeEnd('copyCode')

  // console.time('copyExtensions')
  // await copyExtensions()
  // console.timeEnd('copyExtensions')

  // console.time('copyStaticFiles')
  // await copyStaticFiles()
  // console.timeEnd('copyStaticFiles')

  // console.time('applyOverridesPre')
  // await applyOverridesPre()
  // console.timeEnd('applyOverridesPre')

  // console.time('copyNodeModules')
  // await copyNodeModules()
  // console.timeEnd('copyNodeModules')

  // console.time('bundleJs')
  // await bundleJs()
  // console.timeEnd('bundleJs')

  // console.time('bundleCss')
  // await bundleCss()
  // console.timeEnd('bundleCss')

  // console.time('applyOverridesPost')
  // await applyOverridesPost()
  // console.timeEnd('applyOverridesPost')

  // console.time('rebuildNativeDependencies')
  // await rebuildNativeDependencies(arch)
  // console.timeEnd('rebuildNativeDependencies')

  // console.time('copyElectron')
  // await copyElectron()
  // console.timeEnd('copyElectron')

  // console.time('copyResults')
  // await copyResults()
  // console.timeEnd('copyResults')
}
