import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Replace from '../Replace/Replace.js'
import * as Remove from '../Remove/Remove.js'
import { join } from 'path'

export const bundleMainProcess = async ({ cachePath, commitHash, product, version, bundleMainProcess, bundleSharedProcess }) => {
  await Copy.copy({
    from: 'packages/main-process/src',
    to: Path.join(cachePath, 'src'),
  })

  await Copy.copy({
    from: `packages/main-process/pages`,
    to: `${cachePath}/pages`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `export const isProduction = false`,
    replacement: `export const isProduction = true`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `export const applicationName = 'lvce-oss'`,
    replacement: `export const applicationName = '${product.applicationName}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `export const isLinux = platform === 'linux'`,
    replacement: `export const isLinux = ${Platform.isLinux()}`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `export const isWindows = platform === 'win32'`,
    replacement: `export const isWindows = ${Platform.isWindows()}`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `export const isMacOs = platform === 'darwin'`,
    replacement: `export const isMacOs = ${Platform.isMacos()}`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `export const scheme = 'lvce-oss'`,
    replacement: `export const scheme = '${product.applicationName}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `export const commit = 'unknown commit'`,
    replacement: `export const commit = '${commitHash}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Root/Root.js`,
    occurrence: `export const root = join(__dirname, '../../../../..')`,
    replacement: `export const root = join(__dirname, '../../..')`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `export const version = '0.0.0-dev'`,
    replacement: `export const version = '${version}'`,
  })
  if (bundleSharedProcess) {
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `join(Root.root, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')`,
      replacement: `join(Root.root, 'packages', 'shared-process', 'dist', 'sharedProcessMain.js')`,
    })
  }
  if (bundleMainProcess) {
    await Copy.copy({
      from: 'packages/main-process/node_modules',
      to: Path.join(cachePath, 'node_modules'),
      ignore: ['electron', '@electron', 'rxjs', '@types', 'node-gyp', 'cacache', '.bin'],
    })
    await BundleJs.bundleJs({
      cwd: cachePath,
      from: `./src/mainProcessMain.js`,
      platform: 'node/cjs',
      external: ['electron'],
    })
    await Remove.remove(join(cachePath, 'node_modules'))
  }
  await Replace.replace({
    path: `${cachePath}/src/parts/Root/Root.js`,
    occurrence: `export const root = join(__dirname, '../../..')`,
    replacement: `export const root = join(__dirname, '../../../../..')`,
  })
}
