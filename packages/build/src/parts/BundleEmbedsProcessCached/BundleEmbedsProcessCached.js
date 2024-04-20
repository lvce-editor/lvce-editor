import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleEmbedsProcessCached = async ({ commitHash, product, version, target }) => {
  const cachePath = await CachePaths.getEmbedsProcessCachePath([product, version, commitHash])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleEmbedsProcess')
  } else {
    console.time('bundleEmbedsProcess')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/pty-host'))
    const BundleEmbedsProcess = await import('../BundleEmbedsProcess/BundleEmbedsProcess.js')
    await BundleEmbedsProcess.bundleEmbedsProcess({
      cachePath,
      target,
    })
    console.timeEnd('bundleEmbedsProcess')
  }
  return cachePath
}
