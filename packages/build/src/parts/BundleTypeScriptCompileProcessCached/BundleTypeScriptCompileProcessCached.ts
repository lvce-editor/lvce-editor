import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleTypeScriptCompileProcessCached = async ({ commitHash, product, version, date, target }) => {
  const cachePath = await CachePaths.getTypeScriptCompileProcessCachePath([product, version, date, commitHash])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleTypeScriptCompileProcess')
  } else {
    console.time('bundleTypeScriptCompileProcess')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/shared-process'))
    const BundleTypeScriptCompileProcess = await import('../BundleTypeScriptCompileProcess/BundleTypeScriptCompileProcess.ts')
    await BundleTypeScriptCompileProcess.bundleTypeScriptCompileProcess({
      cachePath,
      target,
    })
    console.timeEnd('bundleTypeScriptCompileProcess')
  }
  return cachePath
}
