import * as BundleJs from '../BundleJs/BundleJs.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleRendererWorker = async ({ cachePath, arch }) => {
  await Copy.copy({
    from: 'packages/renderer-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Developer/Developer.js`,
    occurrence: `../../../../../static/js/pretty-bytes.js`,
    replacement: `../../../static/js/pretty-bytes.js`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Blob/Blob.js`,
    occurrence: `../../../../../static/js/blob-util.js`,
    replacement: `../../../static/js/blob-util.js`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Base64/Base64.js`,
    occurrence: `../../../../../static/js/js-base64.js`,
    replacement: `../../../static/js/js-base64.js`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Ajax/Ajax.js`,
    occurrence: `../../../../../static/js/ky.js`,
    replacement: `../../../static/js/ky.js`,
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/rendererWorkerMain.js`,
    platform: 'webworker',
  })
}
