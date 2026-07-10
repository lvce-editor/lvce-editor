import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleIframeWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/iframe-worker/dist/iframeWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'iframeWorkerMain.js'),
  })
}
