import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleExtensionDetailViewWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/extension-detail-view/dist/extensionDetailViewWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'extensionDetailViewWorkerMain.js'),
  })
}
