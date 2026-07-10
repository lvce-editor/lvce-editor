import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleExtensionSearchViewWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getExtensionSearchViewWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleExtensionSearchViewWorker')
  } else {
    console.time('bundleExtensionSearchViewWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/file-search-worker'))
    const bundleExtensionSearchViewWorker = await import('../BundleExtensionSearchViewWorker/BundleExtensionSearchViewWorker.ts')
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
