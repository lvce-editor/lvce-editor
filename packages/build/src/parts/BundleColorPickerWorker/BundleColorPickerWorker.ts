import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleColorPickerWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/color-picker-worker/dist/colorPickerWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'colorPickerWorkerMain.js'),
  })
}
