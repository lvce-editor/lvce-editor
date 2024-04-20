import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleProcessExplorerCached = async ({ commitHash, product, version, target }) => {
  const cachePath = await CachePaths.getProcessExplorerCachePath([product, version, commitHash])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleProcessExplorer')
  } else {
    console.time('bundleProcessExplorer')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/process-explorer'))
    const BundleProcessExplorer = await import('../BundleProcessExplorer/BundleProcessExplorer.js')
    await BundleProcessExplorer.bundleProcessExplorer({
      cachePath,
      target,
    })
    console.timeEnd('bundleProcessExplorer')
  }
  return cachePath
}
