import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleSourceControlWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getSourceControlWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleSourceControlWorker')
  } else {
    console.time('bundleSourceControlWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/source-control-worker'))
    const bundleSourceControlWorker = await import('../BundleSourceControlWorker/BundleSourceControlWorker.ts')
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
