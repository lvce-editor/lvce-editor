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
    path: `${cachePath}/src/parts/Ajax/Ajax.js`,
    occurrence: `../../../../../static/`,
    replacement: `../../../static/`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/BabelParser/BabelParser.js`,
    occurrence: `../../../../../static/`,
    replacement: `../../../static/`,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/GetExtensionHostSubWorkerUrl/GetExtensionHostSubWorkerUrl.js`,
    occurrence: `new URL('../../../../extension-host-sub-worker/src/extensionHostSubWorkerMain.js', import.meta.url).toString()`,
    replacement: `'${assetDir}/packages/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js'`,
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/extensionHostWorkerMain.js`,
    platform: 'webworker',
    allowCyclicDependencies: false,
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Ajax/Ajax.js`,
    occurrence: `../../../static/`,
    replacement: `../../../../../static/`,
  })
  // workaround for firefox bug
  await Replace.replace({
    path: `${cachePath}/dist/extensionHostWorkerMain.js`,
    occurrence: `//# sourceMappingURL`,
    replacement: `export {}
//# sourceMappingURL`,
  })
}
