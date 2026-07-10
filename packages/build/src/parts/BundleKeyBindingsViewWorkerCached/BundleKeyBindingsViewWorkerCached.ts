import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleKeyBindingsViewWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getKeyBindingsViewWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleKeyBindingsViewWorker')
  } else {
    console.time('bundleKeyBindingsViewWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/terminal-worker'))
    const BundleKeyBindingsViewWorker = await import('../BundleKeyBindingsViewWorker/BundleKeyBindingsViewWorker.ts')
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
