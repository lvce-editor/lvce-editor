import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleEmbedsWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/embeds-worker/dist/embedsWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'embedsWorkerMain.js'),
  })
}
