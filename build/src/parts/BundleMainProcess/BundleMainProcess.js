import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Replace from '../Replace/Replace.js'

export const bundleMainProcess = async ({ cachePath, commitHash, product, version, bundleMainProcess }) => {
  await Copy.copy({
    from: 'packages/main-process/src',
    to: Path.join(cachePath, 'src'),
  })
  await Copy.copy({
    from: `packages/main-process/pages`,
    to: `${cachePath}/pages`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.cjs`,
    occurrence: `exports.isProduction = false`,
    replacement: `exports.isProduction = true`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.cjs`,
    occurrence: `exports.applicationName = 'lvce-oss'`,
    replacement: `exports.applicationName = '${product.applicationName}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.cjs`,
    occurrence: `exports.isLinux = platform === 'linux'`,
    replacement: `exports.isLinux = ${Platform.isLinux()}`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.cjs`,
    occurrence: `exports.isWindows = platform === 'win32'`,
    replacement: `exports.isWindows = ${Platform.isWindows()}`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.cjs`,
    occurrence: `exports.isMacOs = platform === 'darwin'`,
    replacement: `exports.isMacOs = ${Platform.isMacos()}`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.cjs`,
    occurrence: `exports.scheme = 'lvce-oss'`,
    replacement: `exports.scheme = '${product.applicationName}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.cjs`,
    occurrence: `exports.commit = 'unknown commit'`,
    replacement: `exports.commit = '${commitHash}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Root/Root.cjs`,
    occurrence: `exports.root = join(__dirname, '../../../../..')`,
    replacement: `exports.root = join(__dirname, '../../..')`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.cjs`,
    occurrence: `exports.version = '0.0.0-dev'`,
    replacement: `exports.version = '${version}'`,
  })
  if (bundleMainProcess) {
    await BundleJs.bundleJs({
      cwd: cachePath,
      from: `./src/mainProcessMain.cjs`,
      platform: 'node/cjs',
      external: ['electron'],
    })
  }
  await Replace.replace({
    path: `${cachePath}/src/parts/Root/Root.cjs`,
    occurrence: `exports.root = join(__dirname, '../../..')`,
    replacement: `exports.root = join(__dirname, '../../../../..')`,
  })
}
