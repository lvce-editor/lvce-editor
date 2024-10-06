import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleTerminalWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/terminal-worker/dist/terminalWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'terminalWorkerMain.js'),
  })
}
