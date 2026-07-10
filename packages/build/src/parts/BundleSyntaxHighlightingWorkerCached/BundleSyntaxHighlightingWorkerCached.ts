import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'
import * as Logger from '../Logger/Logger.ts'

export const bundleSyntaxHighlightingWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getSyntaxHighlightingWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleSyntaxHighlightingWorker')
  } else {
    console.time('bundleSyntaxHighlightingWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/syntax-highlighting-worker'))
    const BundleSyntaxHighlightingWorker = await import('../BundleSyntaxHighlightingWorker/BundleSyntaxHighlightingWorker.ts')
    await BundleSyntaxHighlightingWorker.bundleSyntaxHighlightingWorker({
      cachePath,
      commitHash,
      platform,
      assetDir,
    })
    console.timeEnd('bundleSyntaxHighlightingWorker')
  }
  return cachePath
}
