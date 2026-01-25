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
    occurrence: `const useIpcForResponse = true`,
    replacement: `const useIpcForResponse = false`,
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
    path: `${cachePath}/dist/mainProcessMain.js`,
    occurrence: `const root = process.env.LVCE_ROOT || join(__dirname$1, '../../../../..')`,
    replacement: `const root = join(__dirname$1, '../../..')`,
  })
  await Replace.replace({
    path: `${cachePath}/dist/mainProcessMain.js`,
    occurrence: `const getSharedProcessPath = () => {
  if (process.env.LVCE_SHARED_PROCESS_PATH) {
    return process.env.LVCE_SHARED_PROCESS_PATH;
  }
  return join(root, 'packages', 'shared-process', 'src', 'sharedProcessMain.ts');
}`,
    replacement: `const getSharedProcessPath = () => {
  return join(root, 'packages', 'shared-process', 'src', 'sharedProcessMain.js');
}`,
  })
}
