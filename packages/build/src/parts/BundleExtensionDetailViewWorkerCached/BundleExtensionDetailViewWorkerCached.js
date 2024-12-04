import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleExtensionDetailViewWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getExtensionDetailViewWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleExtensionDetailViewWorker')
  } else {
    console.time('bundleExtensionDetailViewWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/file-search-worker'))
    const bundleExtensionDetailViewWorker = await import('../BundleExtensionDetailViewWorker/BundleExtensionDetailViewWorker.js')
    await bundleExtensionDetailViewWorker.bundleExtensionDetailViewWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleExtensionDetailViewWorker')
  }
  return cachePath
}
