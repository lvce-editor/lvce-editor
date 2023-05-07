import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleExtensionHostSubWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const extensionHostSubWorkerCachePath = await CachePaths.getExtensionHostSubWorkerCachePath([platform])
  if (existsSync(extensionHostSubWorkerCachePath)) {
    Logger.info('[build step skipped] bundleExtensionHostSubWorker')
  } else {
    console.time('bundleExtensionHostSubWorker')
    await Remove.remove(Path.absolute('build/.tmp/cachedSources/extension-host-worker'))
    const BundleExtensionSubHostWorker = await import('../BundleExtensionSubHostWorker/BundleExtensionHostSubWorker.js')
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
