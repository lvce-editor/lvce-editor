import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleColorPickerWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getColorPickerWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleColorPickerWorker')
  } else {
    console.time('bundleColorPickerWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/color-picker-worker'))
    const bundleColorPickerWorker = await import('../BundleColorPickerWorker/BundleColorPickerWorker.ts')
    await bundleColorPickerWorker.bundleColorPickerWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleColorPickerWorker')
  }
  return cachePath
}
