import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleAboutViewWorker = async ({ cachePath, commitHash, platform, assetDir, version, date, product }) => {
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/about-view/dist/aboutWorkerMain.js',
    to: Path.join(cachePath, 'dist', 'aboutWorkerMain.js'),
  })
  await Replace.replace({
    path: Path.join(cachePath, 'dist', 'aboutWorkerMain.js'),
    occurrence: `const commit = 'unknown commit'`,
    replacement: `const commit = '${commitHash}'`,
  })
  await Replace.replace({
    path: Path.join(cachePath, 'dist', 'aboutWorkerMain.js'),
    occurrence: `date = ''`,
    replacement: `date = '${date}'`,
  })
  await Replace.replace({
    path: Path.join(cachePath, 'dist', 'aboutWorkerMain.js'),
    occurrence: `version = '0.0.0-dev'`,
    replacement: `version = '${version}'`,
  })
}
