import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundleEditorWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getEditorWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleEditorWorker')
  } else {
    console.time('bundleEditorWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/editor-worker'))
    const BundleEditorWorker = await import('../BundleEditorWorker/BundleEditorWorker.js')
    await BundleEditorWorker.bundleEditorWorker({
      cachePath,
    })
    console.timeEnd('bundleEditorWorker')
  }
  return cachePath
}
