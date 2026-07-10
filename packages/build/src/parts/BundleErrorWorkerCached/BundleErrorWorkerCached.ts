import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleErrorWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getErrorWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleErrorWorker')
  } else {
    console.time('bundleErrorWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/error-worker'))
    const BundleErrorWorker = await import('../BundleErrorWorker/BundleErrorWorker.ts')
    await BundleErrorWorker.bundleErrorWorker({
      cachePath,
    })
    console.timeEnd('bundleErrorWorker')
  }
  return cachePath
}
