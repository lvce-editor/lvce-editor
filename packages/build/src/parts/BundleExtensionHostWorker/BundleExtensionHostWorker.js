import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleExtensionHostWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/extension-host-worker/dist/extensionHostWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'extensionHostWorkerMain.js'),
  })
  await Replace.replace({
    path: `${cachePath}/dist/extensionHostWorkerMain.js`,
    occurrence: `ASSET_DIR`,
    replacement: `'${assetDir}'`,
  })
  await Replace.replace({
    path: `${cachePath}/dist/extensionHostWorkerMain.js`,
    occurrence: `new URL('../../../../extension-host-sub-worker/src/extensionHostSubWorkerMain.js', import.meta.url).toString()`,
    replacement: `'${assetDir}/packages/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js'`,
  })
}
