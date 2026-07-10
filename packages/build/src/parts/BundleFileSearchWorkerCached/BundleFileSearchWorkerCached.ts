import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleFileSearchWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getFileSearchWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleFileSearchWorker')
  } else {
    console.time('bundleFileSearchWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/file-search-worker'))
    const bundleFileSearchWorker = await import('../BundleFileSearchWorker/BundleFileSearchWorker.ts')
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
