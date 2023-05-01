import * as BundleJs from '../BundleJs/BundleJs.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleRendererProcess = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copy({
    from: 'packages/renderer-process/src',
    to: Path.join(cachePath, 'src'),
  })
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/BabelParser/BabelParser.js`,
    occurrence: `../../../../../static/`,
    replacement: `../../../static/`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Terminal/Terminal.js`,
    occurrence: `../../../../../static/js/termterm.js`,
    replacement: `../../../static/js/termterm.js`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/SanitizeHtml/SanitizeHtml.js`,
    occurrence: `../../../../../static/`,
    replacement: `../../../static/`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: '/packages/renderer-worker/src/rendererWorkerMain.js',
    replacement: `/packages/renderer-worker/dist/rendererWorkerMain.js`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `ASSET_DIR`,
    replacement: `'${assetDir}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: `PLATFORM`,
    replacement: `'${platform}'`,
  })
  // await Replace.replace({
  //   path: `${cachePath}/src/parts/RendererWorker/RendererWorker.js`,
  //   occurrence: `/src/rendererWorkerMain.js`,
  //   replacement: '/dist/rendererWorkerMain.js',
  // })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/rendererProcessMain.js`,
    platform: 'web',
  })
}
