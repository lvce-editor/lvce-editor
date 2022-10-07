import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleExtensionHostWorkerCached = async ({
  commitHash,
  platform,
  assetDir,
}) => {
  const extensionHostWorkerCachePath =
    await CachePaths.getExtensionHostWorkerCachePath([platform])
  if (existsSync(extensionHostWorkerCachePath)) {
    console.info('[build step skipped] bundleExtensionHostWorker')
  } else {
    console.time('bundleExtensionHostWorker')
    await Remove.remove(
      Path.absolute('build/.tmp/cachedSources/extension-host-worker')
    )
    const BundleExtensionHostWorker = await import(
      '../BundleExtensionHostWorker/BundleExtensionHostWorker.js'
    )
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
