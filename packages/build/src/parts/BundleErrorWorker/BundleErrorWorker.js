import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleErrorWorker = async ({ cachePath }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/error-worker/dist/errorWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'errorWorkerMain.js'),
  })
}
