import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleSearchWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getTerminalWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleSearchWorker')
  } else {
    console.time('bundleSearchWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/extension-host-worker'))
    const BundleSearchWorker = await import('../BundleSearchWorker/BundleSearchWorker.js')
    await BundleSearchWorker.bundleSearchWorker({
      cachePath,
    })
    console.timeEnd('bundleSearchWorker')
  }
  return cachePath
}
