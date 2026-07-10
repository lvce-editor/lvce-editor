import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleExtensionHostSubWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const extensionHostSubWorkerCachePath = await CachePaths.getExtensionHostSubWorkerCachePath([platform])
  if (existsSync(extensionHostSubWorkerCachePath)) {
    Logger.info('[build step skipped] bundleExtensionHostSubWorker')
  } else {
    console.time('bundleExtensionHostSubWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/extension-host-sub-worker'))
    const BundleExtensionSubHostWorker = await import('../BundleExtensionSubHostWorker/BundleExtensionHostSubWorker.ts')
    await BundleExtensionSubHostWorker.bundleExtensionHostSubWorker({
      cachePath: extensionHostSubWorkerCachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleExtensionHostSubWorker')
  }
  return extensionHostSubWorkerCachePath
}
