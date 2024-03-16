import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleTestWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copy({
    from: 'packages/test-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/testWorkerMain.ts`,
    platform: 'webworker',
    allowCyclicDependencies: false,
  })
}
