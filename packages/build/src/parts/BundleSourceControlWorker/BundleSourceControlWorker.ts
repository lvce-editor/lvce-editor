import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleSourceControlWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/source-control-worker/dist/sourceControlWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'sourceControlWorkerMain.js'),
  })
}
