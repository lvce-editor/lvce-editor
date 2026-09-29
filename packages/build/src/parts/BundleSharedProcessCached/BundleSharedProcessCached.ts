import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleSharedProcessCached = async ({ commitHash, product, version, bundleSharedProcess, date, target, isArchLinux, isAppImage }) => {
  const cachePath = await CachePaths.getSharedProcessCachePath([product, version, date, commitHash])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleSharedprocess')
  } else {
    console.time('bundleSharedProcess')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/shared-process'))
    const BundleSharedProcess = await import('../BundleSharedProcess/BundleSharedProcess.ts')
    await BundleSharedProcess.bundleSharedProcess({
      cachePath,
      commitHash,
      product,
      version,
      bundleSharedProcess,
      date,
      target,
      isArchLinux,
      isAppImage,
    })
    console.timeEnd('bundleSharedProcess')
  }
  return cachePath
}
