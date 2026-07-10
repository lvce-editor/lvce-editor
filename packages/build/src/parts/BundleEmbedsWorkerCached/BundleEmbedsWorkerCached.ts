import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleEmbedsWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getEmbedsWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleEmbeds')
  } else {
    console.time('bundleEmbedsWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/embeds-worker'))
    const BundleEmbedsWorker = await import('../BundleEmbedsWorker/BundleEmbedsWorker.ts')
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
