import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleDebugWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/debug-worker/dist/debugWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'debugWorkerMain.js'),
  })
}
