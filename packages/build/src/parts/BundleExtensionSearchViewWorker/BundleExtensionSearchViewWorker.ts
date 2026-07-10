import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleExtensionSearchViewWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/extension-search-view/dist/extensionSearchViewWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'extensionSearchViewWorkerMain.js'),
  })
}
