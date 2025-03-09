import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleIframeWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/iframe-worker/dist/iframeWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'iframeWorkerMain.js'),
  })
}
