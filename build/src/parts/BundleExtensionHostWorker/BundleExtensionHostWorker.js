import * as BundleJs from '../BundleJs/BundleJs.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleExtensionHostWorker = async ({
  cachePath,
  commitHash,
  platform,
  assetDir,
}) => {
  await Copy.copy({
    from: 'packages/extension-host-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/extensionHostWorkerMain.js`,
    platform: 'webworker',
  })
}
