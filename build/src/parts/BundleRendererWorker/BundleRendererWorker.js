import * as BundleJs from '../BundleJs/BundleJs.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleRendererWorker = async ({
  cachePath,
  platform,
  commitHash,
  assetDir,
}) => {
  await Copy.copy({
    from: 'packages/renderer-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/PrettyBytes/PrettyBytes.js`,
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
    occurrence: `../../../../../static/`,
    replacement: `../../../static/`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Ajax/Ajax.js`,
    occurrence: `../../../../../static/`,
    replacement: `../../../static/`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Markdown/Markdown.js`,
    occurrence: `../../../../../static/`,
    replacement: `../../../static/`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/IndexedDb/IndexedDb.js`,
    occurrence: `../../../../../static/`,
    replacement: `../../../static/`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `ASSET_DIR`,
    replacement: `'${assetDir}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: 'export const platform = getPlatform()',
    replacement: `export const platform = '${platform}'`,
  })
  // await Replace.replace({
  //   path: `${cachePath}/src/parts/CacheStorage/CacheStorage.js`,
  //   occurrence: `const CACHE_NAME = 'lvce-runtime'`,
  //   replacement: `const CACHE_NAME = 'lvce-runtime-${commitHash}'`,
  // })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/rendererWorkerMain.js`,
    platform: 'webworker',
  })
}
