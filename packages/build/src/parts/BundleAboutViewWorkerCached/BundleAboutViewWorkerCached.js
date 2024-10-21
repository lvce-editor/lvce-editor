import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleAboutViewWorkerCached = async ({ commitHash, platform, assetDir, date, product, version }) => {
  const cachePath = await CachePaths.getAboutViewWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleAboutViewWorker')
  } else {
    console.time('bundleAboutViewWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/terminal-worker'))
    const BundleAboutViewWorker = await import('../BundleAboutViewWorker/BundleAboutViewWorker.js')
    await BundleAboutViewWorker.bundleAboutViewWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
      date,
      product,
      version,
    })
    console.timeEnd('bundleAboutViewWorker')
  }
  return cachePath
}
