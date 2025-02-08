import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleTitleBarWorker = async ({ cachePath, commitHash, platform, assetDir, version, date, product }) => {
  const aboutPath = Path.join(cachePath, 'dist', 'aboutWorkerMain.js')
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/title-bar-worker/dist/titleBarWorkerMain.js',
    to: aboutPath,
  })
}
