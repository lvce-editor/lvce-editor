import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleMainProcessCached = async ({
  commitHash,
  product,
  version,
  bundleMainProcess,
  bundleSharedProcess,
  isArchLinux,
  isAppImage,
  isLinux,
}) => {
  const cachePath = await CachePaths.getMainProcessCachePath([bundleMainProcess, bundleSharedProcess])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleMainProcess')
  } else {
    console.time('bundleMainProcess')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/main-process'))
    const BundleMainProcess = await import('../BundleMainProcess/BundleMainProcess.ts')
    await BundleMainProcess.bundleMainProcess({
      cachePath,
      commitHash,
      product,
      version,
      bundleMainProcess,
      bundleSharedProcess,
      isArchLinux,
      isAppImage,
      isLinux,
    })
    console.timeEnd('bundleMainProcess')
  }
  return cachePath
}
