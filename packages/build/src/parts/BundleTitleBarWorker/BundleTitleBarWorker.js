import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleTitleBarWorker = async ({ cachePath, commitHash, platform, assetDir, version, date, product }) => {
  const workerPath = Path.join(cachePath, 'dist', 'titleBarWorkerMain.js')
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/title-bar-worker/dist/titleBarWorkerMain.js',
    to: workerPath,
  })
}
