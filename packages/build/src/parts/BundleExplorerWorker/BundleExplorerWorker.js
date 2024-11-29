import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleExplorerWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/explorer-view/dist/explorerViewWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'explorerViewWorkerMain.js'),
  })
}
