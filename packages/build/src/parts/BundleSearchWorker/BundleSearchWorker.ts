import * as BundleJs from '../BundleJsRollup/BundleJsRollup.ts'
import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'
import * as Replace from '../Replace/Replace.ts'

export const bundleSearchWorker = async ({ cachePath }) => {
  await Copy.copy({
    from: 'packages/search-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  for (const file of ['JsonRpc', 'IpcChildModule']) {
    await Replace.replace({
      path: `${cachePath}/src/parts/${file}/${file}.ts`,
      occurrence: `/static/`,
      replacement: `../../../static/`,
    })
  }
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/searchWorkerMain.ts`,
    platform: 'webworker',
    allowCyclicDependencies: false,
  })
}
