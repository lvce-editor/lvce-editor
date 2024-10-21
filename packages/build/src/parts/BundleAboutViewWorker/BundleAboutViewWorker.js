import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleAboutViewWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/about-view/dist/aboutWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'aboutWorkerMain.js'),
  })
}
