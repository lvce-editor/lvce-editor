import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleColorPickerWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/color-picker-worker/dist/colorPickerWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'colorPickerWorkerMain.js'),
  })
}
