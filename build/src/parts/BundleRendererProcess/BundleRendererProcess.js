import * as BundleJs from '../BundleJs/BundleJs.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Replace from '../Replace/Replace.js'

export const bundleRendererProcess = async ({ cachePath, arch }) => {
  await Copy.copy({
    from: 'packages/renderer-process/src',
    to: Path.join(cachePath, 'src'),
  })
  await Copy.copy({
    from: 'static/js',
    to: Path.join(cachePath, 'static', 'js'),
  })
  await Replace.replace({
    path: `${cachePath}/src/parts/Terminal/Terminal.js`,
    occurrence: `../../../../../static/js/termterm.js`,
    replacement: `../../../static/js/termterm.js`,
  })
  await BundleJs.bundleJs({
    cwd: cachePath,
    from: `./src/rendererProcessMain.js`,
    platform: 'web',
  })
}
