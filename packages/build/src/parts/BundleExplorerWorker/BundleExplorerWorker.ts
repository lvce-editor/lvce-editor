import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleExplorerWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/explorer-view/dist/explorerViewWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'explorerViewWorkerMain.js'),
  })
}
