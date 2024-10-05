import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Logger from '../Logger/Logger.js'

export const bundleIframeWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getIframeWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleIframeWorker')
  } else {
    console.time('bundleIframeWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/syntax-highlighting-worker'))
    const BundleIframeWorker = await import('../BundleIframeWorker/BundleIframeWorker.js')
    await BundleIframeWorker.bundleIframeWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleIframeWorker')
  }
  return cachePath
}
