import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Logger from '../Logger/Logger.js'

export const bundleSyntaxHighlightingWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getSyntaxHighlightingWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleSyntaxHighlightingWorker')
  } else {
    console.time('bundleSyntaxHighlightingWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/extension-host-worker'))
    const BundleSyntaxHighlightingWorker = await import('../BundleSyntaxHighlightingWorker/BundleSyntaxHighlightingWorker.js')
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
