import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Logger from '../Logger/Logger.js'

export const bundleRendererProcessCached = async ({ commitHash, platform, assetDir }) => {
  const rendererProcessCachePath = await CachePaths.getRendererProcessCachePath([platform, commitHash])
  if (existsSync(rendererProcessCachePath)) {
    Logger.info('[build step skipped] bundleRendererProcess')
  } else {
    console.time('bundleRendererProcess')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/renderer-process'))
    const BundleRendererProcess = await import('../BundleRendererProcess/BundleRendererProcess.js')
    await BundleRendererProcess.bundleRendererProcess({
      cachePath: rendererProcessCachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleRendererProcess')
  }
  return rendererProcessCachePath
}
