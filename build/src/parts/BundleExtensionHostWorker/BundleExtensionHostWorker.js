import * as BundleJs from '../BundleJs/BundleJs.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

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
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Ajax/Ajax.js`,
    occurrence: `../../../../../static/`,
    replacement: `../../../static/`,
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/extensionHostWorkerMain.js`,
    platform: 'webworker',
  })
}
