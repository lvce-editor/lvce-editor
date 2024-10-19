import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleTextSearchWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/text-search-worker/dist/textSearchWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'textSearchWorkerMain.js'),
  })
}
