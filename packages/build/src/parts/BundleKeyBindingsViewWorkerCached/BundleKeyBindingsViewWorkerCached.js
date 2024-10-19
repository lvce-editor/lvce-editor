import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Logger from '../Logger/Logger.js'

export const bundleKeyBindingsViewWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getKeyBindingsViewWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleKeyBindingsViewWorker')
  } else {
    console.time('bundleKeyBindingsViewWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/terminal-worker'))
    const BundleKeyBindingsViewWorker = await import('../BundleKeyBindingsViewWorker/BundleKeyBindingsViewWorker.js')
    await BundleKeyBindingsViewWorker.bundleKeyBindingsViewWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleKeyBindingsViewWorker')
  }
  return cachePath
}
