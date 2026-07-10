import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleTerminalWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getTerminalWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleTerminalWorker')
  } else {
    console.time('bundleTerminalWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/terminal-worker'))
    const BundleTerminalWorker = await import('../BundleTerminalWorker/BundleTerminalWorker.ts')
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
