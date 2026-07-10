import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleRendererWorkerCached = async ({ commitHash, platform, assetDir, version, date, product }) => {
  const rendererWorkerCachePath = await CachePaths.getRendererWorkerCachePath([platform, commitHash, version, date, product])
  if (existsSync(rendererWorkerCachePath)) {
    Logger.info('[build step skipped] bundleRendererWorker')
  } else {
    console.time('bundleRendererWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/renderer-worker'))
    const BundleRendererWorker = await import('../BundleRendererWorker/BundleRendererWorker.ts')
    await BundleRendererWorker.bundleRendererWorker({
      cachePath: rendererWorkerCachePath,
      platform,
      commitHash,
      assetDir,
      version,
      date,
      product,
    })
    console.timeEnd('bundleRendererWorker')
  }
  return rendererWorkerCachePath
}
