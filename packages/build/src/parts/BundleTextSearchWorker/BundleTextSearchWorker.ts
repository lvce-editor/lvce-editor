import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleTextSearchWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/text-search-worker/dist/textSearchWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'textSearchWorkerMain.js'),
  })
}
