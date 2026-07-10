import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleTitleBarWorkerCached = async ({ commitHash, platform, assetDir, date, product, version }) => {
  const cachePath = await CachePaths.getTitleBarWorkerCachePath([platform, version, product, date])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleTitleBarWorker')
  } else {
    console.time('bundleTitleBarWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/about-view-worker'))
    const BundleTitleBarWorker = await import('../BundleTitleBarWorker/BundleTitleBarWorker.ts')
    await BundleTitleBarWorker.bundleTitleBarWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
      date,
      product,
      version,
    })
    console.timeEnd('bundleTitleBarWorker')
  }
  return cachePath
}
