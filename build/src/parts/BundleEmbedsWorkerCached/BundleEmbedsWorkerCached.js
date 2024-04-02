import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleEmbedsWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getEmbedsWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleEmbeds')
  } else {
    console.time('bundleEmbedsWorker')
    await Remove.remove(Path.absolute('build/.tmp/cachedSources/extension-host-worker'))
    const BundleEmbedsWorker = await import('../BundleEmbedsWorker/BundleEmbedsWorker.js')
    await BundleEmbedsWorker.bundleEmbedsWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleEmbedsWorker')
  }
  return cachePath
}
