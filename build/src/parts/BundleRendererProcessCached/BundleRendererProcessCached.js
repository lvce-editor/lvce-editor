import { existsSync } from 'fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleRendererProcessCached = async ({ commitHash, platform }) => {
  const rendererProcessCachePath =
    await CachePaths.getRendererProcessCachePath()
  if (existsSync(rendererProcessCachePath)) {
    console.info('[build step skipped] bundleRendererProcess')
  } else {
    console.time('bundleRendererProcess')
    await Remove.remove(
      Path.absolute('build/.tmp/cachedSources/renderer-process')
    )
    const BundleRendererProcess = await import(
      '../BundleRendererProcess/BundleRendererProcess.js'
    )
    await BundleRendererProcess.bundleRendererProcess({
      cachePath: rendererProcessCachePath,
      commitHash,
      platform,
    })
    console.timeEnd('bundleRendererProcess')
  }
  return rendererProcessCachePath
}
