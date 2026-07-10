import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleExtensionHostWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const extensionHostWorkerCachePath = await CachePaths.getExtensionHostWorkerCachePath([platform])
  if (existsSync(extensionHostWorkerCachePath)) {
    Logger.info('[build step skipped] bundleExtensionHostWorker')
  } else {
    console.time('bundleExtensionHostWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/extension-host-worker'))
    const BundleExtensionHostWorker = await import('../BundleExtensionHostWorker/BundleExtensionHostWorker.ts')
    await BundleExtensionHostWorker.bundleExtensionHostWorker({
      cachePath: extensionHostWorkerCachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleExtensionHostWorker')
  }
  return extensionHostWorkerCachePath
}
