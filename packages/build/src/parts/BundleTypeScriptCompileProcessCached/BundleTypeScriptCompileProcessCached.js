import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleTypeScriptCompileProcessCached = async ({ commitHash, product, version, date, target }) => {
  const cachePath = await CachePaths.getNetworkProcessCachePath([product, version, date, commitHash])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleTypeScriptCompileProcess')
  } else {
    console.time('bundleTypeScriptCompileProcess')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/shared-process'))
    const BundleTypeScriptCompileProcess = await import('../BundleTypeScriptCompileProcess/BundleTypeScriptCompileProcess.js')
    await BundleTypeScriptCompileProcess.bundleTypeScriptCompileProcess({
      cachePath,
      target,
    })
    console.timeEnd('bundleTypeScriptCompileProcess')
  }
  return cachePath
}
