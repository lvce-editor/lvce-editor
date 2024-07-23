import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleTestWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const testWorkerCachePath = await CachePaths.getTestWorkerCachePath([platform])
  if (existsSync(testWorkerCachePath)) {
    Logger.info('[build step skipped] bundleTestWorker')
  } else {
    console.time('bundleTestWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/extension-host-worker'))
    const BundleTestWorker = await import('../BundleTestWorker/BundleTestWorker.js')
    await BundleTestWorker.bundleTestWorker({
      cachePath: testWorkerCachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleTestWorker')
  }
  return testWorkerCachePath
}
