import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleSyntaxHighlightingWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'syntaxHighlightingWorkerMain.js'),
  })
}
