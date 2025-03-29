import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleFileSearchWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/file-search-worker/dist/fileSearchWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'fileSearchWorkerMain.js'),
  })
}
