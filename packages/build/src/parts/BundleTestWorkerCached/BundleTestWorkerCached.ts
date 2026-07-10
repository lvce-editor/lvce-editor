import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleTestWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const testWorkerCachePath = await CachePaths.getTestWorkerCachePath([platform])
  if (existsSync(testWorkerCachePath)) {
    Logger.info('[build step skipped] bundleTestWorker')
  } else {
    console.time('bundleTestWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/test-worker'))
    const BundleTestWorker = await import('../BundleTestWorker/BundleTestWorker.ts')
    await BundleTestWorker.bundleTestWorker({
      cachePath: testWorkerCachePath,
    })
    console.timeEnd('bundleTestWorker')
  }
  return testWorkerCachePath
}
