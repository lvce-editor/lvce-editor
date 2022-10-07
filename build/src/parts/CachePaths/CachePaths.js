import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'

const getRendererProcessCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/renderer-process/src',
    [
      'build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'build/src/parts/BuildServer/BuildServer.js',
      'build/src/parts/BundleJs/BundleJs.js',
      'build/src/parts/CachePaths/CachePaths.js',
      'build/src/parts/BundleRendererProcess/BundleRendererProcess.js',
      'build/src/parts/BundleRendererProcessCached/BundleRendererProcessCached.js',
    ],
    extraContents
  )
  return hash
}

export const getRendererProcessCachePath = async (extraContents) => {
  const rendererProcessCacheHash = await getRendererProcessCacheHash(
    extraContents
  )
  const rendererProcessCachePath = Path.join(
    Path.absolute('build/.tmp/cachedSources/renderer-process'),
    rendererProcessCacheHash
  )
  return rendererProcessCachePath
}

const getRendererWorkerCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/renderer-worker/src',
    [
      'build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'build/src/parts/BuildServer/BuildServer.js',
      'build/src/parts/BundleJs/BundleJs.js',
      'build/src/parts/CachePaths/CachePaths.js',
      'build/src/parts/BundleRendererWorker/BundleRendererWorker.js',
      'build/src/parts/BundleRendererWorkerCached/BundleRendererWorkerCached.js',
    ],
    extraContents
  )
  return hash
}

export const getRendererWorkerCachePath = async (extraContents) => {
  const rendererWorkerCacheHash = await getRendererWorkerCacheHash(
    extraContents
  )
  const rendererWorkerCachePath = Path.join(
    Path.absolute('build/.tmp/cachedSources/renderer-worker'),
    rendererWorkerCacheHash
  )
  return rendererWorkerCachePath
}

const getExtensionHostWorkerCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/extension-host-worker/src',
    [
      'build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'build/src/parts/BuildServer/BuildServer.js',
      'build/src/parts/BundleJs/BundleJs.js',
      'build/src/parts/CachePaths/CachePaths.js',
      'build/src/parts/BundleRendererWorker/BundleRendererWorker.js',
      'build/src/parts/BundleRendererWorkerCached/BundleRendererWorkerCached.js',
    ],
    extraContents
  )
  return hash
}

export const getExtensionHostWorkerCachePath = async (extraContents) => {
  const extensionHostWorkerCacheHash = await getExtensionHostWorkerCacheHash(
    extraContents
  )
  const extensionHostWorkerCachePath = Path.join(
    Path.absolute('build/.tmp/cachedSources/extension-host-worker'),
    extensionHostWorkerCacheHash
  )
  return extensionHostWorkerCachePath
}
