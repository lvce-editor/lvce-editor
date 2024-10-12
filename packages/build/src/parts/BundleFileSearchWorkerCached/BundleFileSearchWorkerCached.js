import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Logger from '../Logger/Logger.js'

export const bundleFileSearchWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getFileSearchWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleFileSearchWorker')
  } else {
    console.time('bundleFileSearchWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/file-search-worker'))
    const bundleFileSearchWorker = await import('../BundleFileSearchWorker/BundleFileSearchWorker.js')
    await bundleFileSearchWorker.bundleFileSearchWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleFileSearchWorker')
  }
  return cachePath
}
