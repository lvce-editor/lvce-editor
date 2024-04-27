import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleNetworkProcessCached = async ({ commitHash, product, version, date, target, isArchLinux, isAppImage }) => {
  const cachePath = await CachePaths.getNetworkProcessCachePath([product, version, date, commitHash])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleNetworkprocess')
  } else {
    console.time('bundleNetworkProcess')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/shared-process'))
    const BundleNetworkProcess = await import('../BundleNetworkProcess/BundleNetworkProcess.js')
    await BundleNetworkProcess.bundleNetworkProcess({
      cachePath,
      target,
    })
    console.timeEnd('bundleNetworkProcess')
  }
  return cachePath
}
