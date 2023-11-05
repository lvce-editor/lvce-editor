import { VError } from '@lvce-editor/verror'
import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleRendererProcess = async ({ cachePath, commitHash, platform, assetDir }) => {
  try {
    await Copy.copy({
      from: 'packages/renderer-process/src',
      to: Path.join(cachePath, 'src'),
    })
    await Copy.copy({
      from: 'static/js',
      to: Path.join(cachePath, 'static', 'js'),
    })
    for (const file of ['BabelParser', 'Ajax', 'Terminal']) {
      await Replace.replace({
        path: `${cachePath}/src/parts/${file}/${file}.js`,
        occurrence: `../../../../../static/`,
        replacement: `../../../static/`,
      })
    }
    await Replace.replace({
      path: `${cachePath}/src/parts/RendererWorkerUrl/RendererWorkerUrl.js`,
      occurrence: '/packages/renderer-worker/src/rendererWorkerMain.js',
      replacement: `/packages/renderer-worker/dist/rendererWorkerMain.js`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/AssetDir/AssetDir.js`,
      occurrence: `ASSET_DIR`,
      replacement: `'${assetDir}'`,
    })
    await Replace.replace({
      path: `${cachePath}/src/parts/Platform/Platform.js`,
      occurrence: `PLATFORM`,
      replacement: `'${platform}'`,
    })
    if (platform === 'electron') {
      await Replace.replace({
        path: `${cachePath}/src/parts/IsFirefox/IsFirefox.js`,
        occurrence: `export const isFirefox = getIsFirefox()`,
        replacement: `export const isFirefox = false`,
      })
    }
    await BundleJs.bundleJs({
      cwd: cachePath,
      from: `./src/rendererProcessMain.js`,
      platform: 'web',
    })
  } catch (error) {
    throw new VError(error, `Failed to bundle renderer process`)
  }
}
