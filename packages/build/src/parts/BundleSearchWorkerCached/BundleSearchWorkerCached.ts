import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleSearchWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getTerminalWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleSearchWorker')
  } else {
    console.time('bundleSearchWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/search-worker'))
    const BundleSearchWorker = await import('../BundleSearchWorker/BundleSearchWorker.ts')
    await BundleSearchWorker.bundleSearchWorker({
      cachePath,
    })
    console.timeEnd('bundleSearchWorker')
  }
  return cachePath
}
