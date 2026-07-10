import { existsSync } from 'node:fs'
import * as CachePaths from '../CachePaths/CachePaths.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Path from '../Path/Path.ts'
import * as Remove from '../Remove/Remove.ts'

export const bundleEditorWorkerCached = async ({ commitHash, platform, assetDir }) => {
  const cachePath = await CachePaths.getEditorWorkerCachePath([platform])
  if (existsSync(cachePath)) {
    Logger.info('[build step skipped] bundleEditorWorker')
  } else {
    console.time('bundleEditorWorker')
    await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/editor-worker'))
    const BundleEditorWorker = await import('../BundleEditorWorker/BundleEditorWorker.ts')
    await BundleEditorWorker.bundleEditorWorker({
      cachePath,
    })
    console.timeEnd('bundleEditorWorker')
  }
  return cachePath
}
