import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Logger from '../Logger/Logger.js'

export const bundleDebugWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getIframeWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleDebugWorker')
  } else {
    console.time('bundleDebugWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/syntax-highlighting-worker'))
    const bundleDebugWorker = await import('../BundleDebugWorker/BundleDebugWorker.js')
    await bundleDebugWorker.bundleDebugWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleDebugWorker')
  }
  return cachePath
}
