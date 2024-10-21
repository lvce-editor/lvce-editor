import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleAboutViewWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/about-view/dist/aboutWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'aboutWorkerMain.js'),
  })
  await Replace.replace({
    path: Path.join(cachePath, 'dist', 'aboutWorkerMain.js'),
    occurrence: `const commit = ''`,
    replacement: `const commit = '${commitHash}'`,
  })
}
