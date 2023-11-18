import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleExtensionHostSubWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copy({
    from: 'packages/extension-host-sub-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/AssetDir/AssetDir.js`,
    occurrence: `ASSET_DIR`,
    replacement: `'${assetDir}'`,
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/extensionHostSubWorkerMain.js`,
    platform: 'webworker',
    allowCyclicDependencies: false,
  })
}
