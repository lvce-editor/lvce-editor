import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleExtensionHostSubWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  const subworkerPath = Path.join(cachePath, 'dist', 'extensionHostSubWorkerMain.js')
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js',
    to: subworkerPath,
  })
}
