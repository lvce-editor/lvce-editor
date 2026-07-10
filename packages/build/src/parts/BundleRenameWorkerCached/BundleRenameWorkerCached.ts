import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleRenameWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getRenameWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleRenameWorker')
  } else {
    console.time('bundleRenameWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/rename-worker'))
    const bundleRenameWorker = await import('../BundleRenameWorker/BundleRenameWorker.ts')
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
