import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleExtensionSearchViewWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getExtensionSearchViewWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleExtensionSearchViewWorker')
  } else {
    console.time('bundleExtensionSearchViewWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/file-search-worker'))
    const bundleExtensionSearchViewWorker = await import('../BundleExtensionSearchViewWorker/BundleExtensionSearchViewWorker.js')
    await bundleExtensionSearchViewWorker.bundleExtensionSearchViewWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleExtensionSearchViewWorker')
  }
  return cachePath
}
