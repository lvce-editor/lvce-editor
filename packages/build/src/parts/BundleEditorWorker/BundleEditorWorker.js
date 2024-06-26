import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleEditorWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  await Copy.copy({
    from: 'packages/editor-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/editorWorkerMain.ts`,
    platform: 'webworker',
    allowCyclicDependencies: false,
  })
}
