import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleDiffWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getEmbedsWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleDiffWorker')
  } else {
    console.time('bundleDiffWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/diff-worker'))
    const BundleDiffWorker = await import('../BundleDiffWorker/BundleDiffWorker.js')
    await BundleDiffWorker.bundleDiffWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleDiffWorker')
  }
  return cachePath
}
