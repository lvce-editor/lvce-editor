import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleKeyBindingsViewWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/keybindings-view/dist/keyBindingsViewWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'keyBindingsViewWorkerMain.js'),
  })
}
