import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleErrorWorker = async ({ cachePath }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/error-worker/dist/errorWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'errorWorkerMain.js'),
  })
}
