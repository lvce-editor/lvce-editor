import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'

export const bundleSyntaxHighlightingWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'syntaxHighlightingWorkerMain.js'),
  })
}
