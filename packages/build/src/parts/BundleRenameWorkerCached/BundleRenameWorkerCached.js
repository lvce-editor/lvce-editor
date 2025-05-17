import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Logger from '../Logger/Logger.js'

export const bundleRenameWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getRenameWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleRenameWorker')
  } else {
    console.time('bundleRenameWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/rename-worker'))
    const bundleRenameWorker = await import('../BundleRenameWorker/BundleRenameWorker.js')
    await bundleRenameWorker.bundleRenameWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleRenameWorker')
  }
  return cachePath
}
