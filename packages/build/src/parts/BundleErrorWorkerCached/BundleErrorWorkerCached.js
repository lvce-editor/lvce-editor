import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleErrorWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getErrorWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleErrorWorker')
  } else {
    console.time('bundleErrorWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/error-worker'))
    const BundleErrorWorker = await import('../BundleErrorWorker/BundleErrorWorker.js')
    await BundleErrorWorker.bundleErrorWorker({
      cachePath,
    })
    console.timeEnd('bundleErrorWorker')
  }
  return cachePath
}
