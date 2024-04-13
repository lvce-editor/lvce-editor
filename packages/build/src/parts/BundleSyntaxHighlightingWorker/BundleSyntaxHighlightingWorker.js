import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleSyntaxHighlightingWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copy({
    from: 'packages/syntax-highlighting-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  for (const file of [ 'JsonRpc']) {
    await Replace.replace({
      path: `${cachePath}/src/parts/${file}/${file}.ts`,
      occurrence: `../../../../../static/`,
      replacement: `../../../static/`,
    })
  }
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/syntaxHighlightingWorkerMain.ts`,
    platform: 'webworker',
    allowCyclicDependencies: false,
  })
}
