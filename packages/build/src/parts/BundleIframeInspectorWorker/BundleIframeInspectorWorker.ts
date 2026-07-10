import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleIframeInspectorWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/iframe-inspector/dist/iframeInspectorWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'iframeInspectorWorkerMain.js'),
  })
}
