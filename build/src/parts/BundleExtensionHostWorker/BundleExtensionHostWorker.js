import * as BundleJs from '../BundleJsRollup/BundleJsRollup.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleExtensionHostWorker = async ({ cachePath, commitHash, platform, assetDir }) => {
  await Copy.copy({
    from: 'packages/extension-host-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/AssetDir/AssetDir.ts`,
    occurrence: `ASSET_DIR`,
    replacement: `'${assetDir}'`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.ts`,
    occurrence: `new URL('../../../../extension-host-sub-worker/src/extensionHostSubWorkerMain.js', import.meta.url).toString()`,
    replacement: `'${assetDir}/packages/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js'`,
  })
  for (const file of ['JsonRpc']) {
    await Replace.replace({
      path: `${cachePath}/src/parts/${file}/${file}.ts`,
      occurrence: `../../../../../static/`,
      replacement: `../../../static/`,
    })
  }
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/extensionHostWorkerMain.ts`,
    platform: 'webworker',
    allowCyclicDependencies: false,
  })
}
