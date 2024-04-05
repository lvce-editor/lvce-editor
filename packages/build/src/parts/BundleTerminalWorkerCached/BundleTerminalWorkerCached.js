import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Logger from '../Logger/Logger.js'

export const bundleTerminalWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getTerminalWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleTerminalWorker')
  } else {
    console.time('bundleTerminalWorker')
    await Remove.remove(Path.absolute('build/.tmp/cachedSources/extension-host-worker'))
    const BundleTerminalWorker = await import('../BundleTerminalWorker/BundleTerminalWorker.js')
    await BundleTerminalWorker.bundleTerminalWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleTerminalWorker')
  }
  return cachePath
}
