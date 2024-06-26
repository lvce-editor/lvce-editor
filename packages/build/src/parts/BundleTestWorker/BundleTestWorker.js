import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleTestWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  await Copy.copy({
    from: 'packages/test-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  for (const file of ['JsonRpc', 'IpcChildModule', 'VError']) {
    await Replace.replace({
      path: `${cachePath}/src/parts/${file}/${file}.ts`,
      occurrence: `/static/`,
      replacement: `../../../static/`,
    })
  }
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/testWorkerMain.ts`,
    platform: 'webworker',
    allowCyclicDependencies: false,
  })
}
