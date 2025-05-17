import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleRenameWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/rename-worker/dist/renameWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'renameWorkerMain.js'),
  })
}
