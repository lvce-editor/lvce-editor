import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleExtensionDetailViewWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/extension-detail-view/dist/extensionDetailViewWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'extensionDetailViewWorkerMain.js'),
  })
}
