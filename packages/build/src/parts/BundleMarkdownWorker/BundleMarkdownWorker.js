import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleMarkdownWorker = async ({ cachePath, commitHash, platform, assetDir, version, date, product }) => {
  const path = Path.join(cachePath, 'dist', 'markdownWorkerMain.js')
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/markdown-worker/dist/markdownWorkerMain.js',
    to: path,
  })
}
