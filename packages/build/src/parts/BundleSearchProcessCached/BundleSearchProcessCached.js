import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleSearchProcessCached = async ({ commitHash, product, version, target }) => {
  const cachePath = await CachePaths.getSearchProcessCachePath([product, version, commitHash])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleSearchProcess')
  } else {
    console.time('bundleSearchProcess')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/pty-host'))
    const BundleSearchProcess = await import('../BundleSearchProcess/BundleSearchProcess.js')
    await BundleSearchProcess.bundleSearchProcess({
      cachePath,
      target,
    })
    console.timeEnd('bundleSearchProcess')
  }
  return cachePath
}
