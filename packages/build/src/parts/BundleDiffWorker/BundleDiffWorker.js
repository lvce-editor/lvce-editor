import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleDiffWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copy({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/diff-worker/dist/diffWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'diffWorkerMain.js'),
  })
}
