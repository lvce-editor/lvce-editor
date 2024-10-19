import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleTextSearchWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getTextSearchWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleTextSearchWorker')
  } else {
    console.time('bundleTextSearchWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/file-search-worker'))
    const bundleTextSearchWorker = await import('../BundleTextSearchWorker/BundleTextSearchWorker.js')
    await bundleTextSearchWorker.bundleTextSearchWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleTextSearchWorker')
  }
  return cachePath
}
