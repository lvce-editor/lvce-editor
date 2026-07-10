import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleTestWorker = async ({ cachePath }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/test-worker/dist/testWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'testWorkerMain.js'),
  })
}
