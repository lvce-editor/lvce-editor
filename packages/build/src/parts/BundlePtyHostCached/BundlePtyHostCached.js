import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundlePtyHostCached = async ({ commitHash, product, version, target }) => {
  const cachePath = await CachePaths.getPtyHostCachePath([product, version, commitHash])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundlePtyHost')
  } else {
    console.time('bundlePtyHost')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/pty-host'))
    const BundlePtyHost = await import('../BundlePtyHost/BundlePtyHost.js')
    await BundlePtyHost.bundlePtyHost({
      cachePath,
      target,
    })
    console.timeEnd('bundlePtyHost')
  }
  return cachePath
}
