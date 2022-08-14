import { existsSync } from 'fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleRendererWorkerCached = async ({
  commitHash,
  platform,
  assetDir,
}) => {
  const rendererWorkerCachePath = await CachePaths.getRendererWorkerCachePath()
  if (existsSync(rendererWorkerCachePath)) {
    console.info('[build step skipped] bundleRendererWorker')
  } else {
    console.time('bundleRendererWorker')
    await Remove.remove(
      Path.absolute('build/.tmp/cachedSources/renderer-worker')
    )
    const BundleRendererWorker = await import(
      '../BundleRendererWorker/BundleRendererWorker.js'
    )
    await BundleRendererWorker.bundleRendererWorker({
      cachePath: rendererWorkerCachePath,
      platform: platform,
      commitHash,
      assetDir,
    })
    console.timeEnd('bundleRendererWorker')
  }
  return rendererWorkerCachePath
}
