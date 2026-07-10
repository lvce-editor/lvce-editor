import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

export const bundleEditorWorker = async ({ cachePath }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/editor-worker/dist/editorWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'editorWorkerMain.js'),
  })
}
