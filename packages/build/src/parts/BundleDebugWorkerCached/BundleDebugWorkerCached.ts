import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleDebugWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getDebugWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleDebugWorker')
  } else {
    console.time('bundleDebugWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/syntax-highlighting-worker'))
    const bundleDebugWorker = await import('../BundleDebugWorker/BundleDebugWorker.ts')
    await bundleDebugWorker.bundleDebugWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleDebugWorker')
  }
  return cachePath
}
