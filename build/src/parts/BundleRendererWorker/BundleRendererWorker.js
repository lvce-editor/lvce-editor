import * as BundleJs from '../BundleJs/BundleJs.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleRendererWorker = async ({ cachePath, platform, commitHash, assetDir }) => {
  await Copy.copy({
    from: 'packages/renderer-worker/src',
    to: Path.join(cachePath, 'src'),
  })
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  for (const file of ['PrettyBytes', 'BabelParser', 'Blob', 'Base64', 'Ajax', 'Markdown', 'IndexedDb']) {
    await Replace.replace({
      path: `${cachePath}/src/parts/${file}/${file}.js`,
      occurrence: `../../../../../static/`,
      replacement: `../../../static/`,
    })
  }
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
  await Replace.replace({
    path: `${cachePath}/src/parts/Platform/Platform.js`,
    occurrence: '/packages/extension-host-worker/src/extensionHostWorkerMain.js',
    replacement: `/packages/extension-host-worker/dist/extensionHostWorkerMain.js`,
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/rendererWorkerMain.js`,
    platform: 'webworker',
  })
  // workaround for firefox bug
  await Replace.replace({
    path: `${cachePath}/dist/rendererWorkerMain.js`,
    occurrence: `//# sourceMappingURL`,
    replacement: `export {}
//# sourceMappingURL`,
  })
}
