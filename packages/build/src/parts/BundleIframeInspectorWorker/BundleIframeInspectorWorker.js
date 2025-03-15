import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleIframeInspectorWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/iframe-inspector/dist/iframeInspectorWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'iframeInspectorWorkerMain.js'),
  })
}
