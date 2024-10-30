import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleFileSearchWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/file-search-worker/dist/fileSearchWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'fileSearchWorkerMain.js'),
  })
  await Replace.replace({
    path: `${cachePath}/dist/fileSearchWorkerMain.js`,
    occurrence: `const assetDir = ''`,
    replacement: `const assetDir = '${assetDir}'`,
  })
}
