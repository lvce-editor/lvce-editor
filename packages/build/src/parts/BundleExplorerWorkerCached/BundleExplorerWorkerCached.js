import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleExplorerWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getTextSearchWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleExplorerWorker')
  } else {
    console.time('bundleExplorerWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/explorer-worker'))
    const bundleExplorerWorker = await import('../BundleExplorerWorker/BundleExplorerWorker.js')
    await bundleExplorerWorker.bundleExplorerWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleExplorerWorker')
  }
  return cachePath
}
