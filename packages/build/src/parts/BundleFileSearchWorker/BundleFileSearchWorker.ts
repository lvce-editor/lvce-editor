import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleFileSearchWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/file-search-worker/dist/fileSearchWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'fileSearchWorkerMain.js'),
  })
}
