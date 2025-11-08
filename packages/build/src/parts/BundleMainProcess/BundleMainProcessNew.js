import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleMainProcess = async ({
  cachePath,
  commitHash,
  product,
  version,
  bundleMainProcess,
  bundleSharedProcess,
  isArchLinux,
  isAppImage,
  isLinux,
}) => {
  await Copy.copy({
    from: 'packages/main-process/node_modules/@lvce-editor/main-process/dist',
    to: Path.join(cachePath, 'dist'),
  })

  await Copy.copy({
    from: `packages/main-process/node_modules/@lvce-editor/main-process/pages`,
    to: `${cachePath}/pages`,
  })
  await Replace.replace({
    path: `${cachePath}/dist/mainProcessMain.js`,
    occurrence: `const isProduction = false`,
    replacement: `const isProduction = true`,
  })
  await Replace.replace({
    path: `${cachePath}/dist/mainProcessMain.js`,
    occurrence: `const applicationName = 'lvce-oss'`,
    replacement: `const applicationName = '${product.applicationName}'`,
  })
  await Replace.replace({
    path: `${cachePath}/dist/mainProcessMain.js`,
    occurrence: `const WebView = 'lvce-oss-webview'`,
    replacement: `const WebView = '${product.applicationName}-webview'`,
  })
  await Replace.replace({
    path: `${cachePath}/dist/mainProcessMain.js`,
    occurrence: `const isLinux = platform === 'linux'`,
    replacement: `const isLinux = ${isLinux}`,
  })
  await Replace.replace({
    path: `${cachePath}/dist/mainProcessMain.js`,
    occurrence: `const scheme = 'lvce-oss'`,
    replacement: `const scheme = '${product.applicationName}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Root/Root.js`,
    occurrence: `const root = process.env.LVCE_ROOT || join$1(__dirname$1, '../../../../..')`,
    replacement: `const root = join(__dirname, '../../..')`,
  })
  // if (isArchLinux) {
  //   await Replace.replace({
  //     path: `${cachePath}/src/parts/Platform/Platform.js`,
  //     occurrence: `export const isArchLinux = false`,
  //     replacement: `export const isArchLinux = true`,
  //   })
  // }
  // if (isAppImage) {
  //   await Replace.replace({
  //     path: `${cachePath}/src/parts/Platform/Platform.js`,
  //     occurrence: `export const isAppImage = false`,
  //     replacement: `export const isAppImage = true`,
  //   })
  // }
  // if (bundleSharedProcess) {
  //   await Replace.replace({
  //     path: `${cachePath}/src/parts/Platform/Platform.js`,
  //     occurrence: `join(Root.root, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')`,
  //     replacement: `join(Root.root, 'packages', 'shared-process', 'dist', 'sharedProcessMain.js')`,
  //   })
  // }
  // if (bundleMainProcess) {
  //   await Copy.copy({
  //     from: 'packages/main-process/node_modules',
  //     to: Path.join(cachePath, 'node_modules'),
  //     ignore: ['electron', '@electron', 'rxjs', '@types', 'node-gyp', 'cacache', '.bin'],
  //   })
  //   await BundleJs.bundleJs({
  //     cwd: cachePath,
  //     from: `./src/mainProcessMain.js`,
  //     platform: 'node',
  //     external: ['electron'],
  //     // @ts-ignore
  //     sourceMap: false,
  //   })
  //   await Remove.remove(join(cachePath, 'src'))
  //   await Remove.remove(join(cachePath, 'node_modules'))
  // } else {
  //   await Replace.replace({
  //     path: `${cachePath}/src/parts/Root/Root.js`,
  //     occurrence: `export const root = join(__dirname, '../../..')`,
  //     replacement: `export const root = join(__dirname, '../../../../..')`,
  //   })
  // }
}
