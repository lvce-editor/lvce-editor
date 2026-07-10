import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleTerminalWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/terminal-worker/dist/terminalWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'terminalWorkerMain.js'),
  })
}
