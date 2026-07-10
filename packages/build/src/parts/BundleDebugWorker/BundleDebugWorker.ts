import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleDebugWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/debug-worker/dist/debugWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'debugWorkerMain.js'),
  })
}
