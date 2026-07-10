import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleExtensionDetailViewWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getExtensionDetailViewWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleExtensionDetailViewWorker')
  } else {
    console.time('bundleExtensionDetailViewWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/file-search-worker'))
    const bundleExtensionDetailViewWorker = await import('../BundleExtensionDetailViewWorker/BundleExtensionDetailViewWorker.ts')
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
