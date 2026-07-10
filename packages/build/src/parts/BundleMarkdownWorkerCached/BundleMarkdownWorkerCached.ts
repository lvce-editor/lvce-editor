import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleMarkdownWorkerCached = async ({ commitHash, platform, assetDir, date, product, version }) => {
  const cachePath = await CachePaths.getMarkdownWorkerCachePath([platform, version, product, date])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleMarkdownWorker')
  } else {
    console.time('bundleMarkdownWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/about-view-worker'))
    const bundleMarkdownWorker = await import('../BundleMarkdownWorker/BundleMarkdownWorker.ts')
    await bundleMarkdownWorker.bundleMarkdownWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
      date,
      product,
      version,
    })
    console.timeEnd('bundleMarkdownWorker')
  }
  return cachePath
}
