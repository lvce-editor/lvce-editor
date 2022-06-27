import { existsSync } from 'fs'
import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Copy from '../Copy/Copy.js'

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

export const build = async () => {
  const arch = process.arch
  const cache = true
  const cacheHash = await getDependencyCacheHash()

  const cachePath = Path.join(
    Path.absolute('build/.tmp/cachedDependencies'),
    cacheHash
  )

  if (existsSync(cachePath)) {
    console.info('[build step skipped] bundleElectronAppDependencies')
  } else {
    console.time('bundleElectronAppDependencies')
    const BundleElectronAppDependencies = await import(
      '../BundleElectronAppDependencies/BundleElectronAppDependencies.js'
    )
    await BundleElectronAppDependencies.bundleElectronAppDependencies({
      cachePath,
      arch,
    })
    console.timeEnd('bundleElectronAppDependencies')
  }
  console.log({ cachePath })

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
