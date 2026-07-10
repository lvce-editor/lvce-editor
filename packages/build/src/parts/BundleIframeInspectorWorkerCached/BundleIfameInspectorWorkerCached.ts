import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleIframeInspectorWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getIframeInspectorWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleIframeInspector')
  } else {
    console.time('bundleIframeInspector')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/file-search-worker'))
    const bundleIframeInspector = await import('../BundleIframeInspectorWorker/BundleIframeInspectorWorker.ts')
    await bundleIframeInspector.bundleIframeInspectorWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleIframeInspector')
  }
  return cachePath
}
