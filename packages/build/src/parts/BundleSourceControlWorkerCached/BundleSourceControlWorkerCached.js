import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Logger from '../Logger/Logger.js'

export const bundleSourceControlWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getSourceControlWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleSourceControlWorker')
  } else {
    console.time('bundleSourceControlWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/source-control-worker'))
    const bundleSourceControlWorker = await import('../BundleSourceControlWorker/BundleSourceControlWorker.js')
    await bundleSourceControlWorker.bundleSourceControlWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleSourceControlWorker')
  }
  return cachePath
}
