import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleAboutViewWorker = async ({ cachePath, commitHash, platform, assetDir, version, date, product }) => {
  const aboutPath = Path.join(cachePath, 'dist', 'aboutWorkerMain.js')
  await Copy.copyFile({
    from: 'packages/renderer-worker/node_modules/@lvce-editor/about-view/dist/aboutWorkerMain.js',
    to: aboutPath,
  })
  await Replace.replace({
    path: aboutPath,
    occurrence: `const commit = 'unknown commit'`,
    replacement: `const commit = '${commitHash}'`,
  })
  await Replace.replace({
    path: aboutPath,
    occurrence: `commitDate = ''`,
    replacement: `commitDate = '${date}'`,
  })
  await Replace.replace({
    path: aboutPath,
    occurrence: `version = '0.0.0-dev'`,
    replacement: `version = '${version}'`,
  })
}
