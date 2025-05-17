import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Logger from '../Logger/Logger.js'

export const bundleColorPickerWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getIframeWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleColorPickerWorker')
  } else {
    console.time('bundleColorPickerWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/color-picker-worker'))
    const bundleColorPickerWorker = await import('../BundleColorPickerWorker/BundleColorPickerWorker.js')
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
