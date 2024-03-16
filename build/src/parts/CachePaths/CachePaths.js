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
    extraContents,
  )
  return hash
}

export const getRendererProcessCachePath = async (extraContents) => {
  const rendererProcessCacheHash = await getRendererProcessCacheHash(extraContents)
  const rendererProcessCachePath = Path.join(Path.absolute('build/.tmp/cachedSources/renderer-process'), rendererProcessCacheHash)
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
      'build/src/parts/EagerLoadedCss/EagerLoadedCss.js',
      'build/src/parts/GetCssDeclarationFiles/GetCssDeclarationFiles.js',
    ],
    extraContents,
  )
  return hash
}

export const getRendererWorkerCachePath = async (extraContents) => {
  const rendererWorkerCacheHash = await getRendererWorkerCacheHash(extraContents)
  const rendererWorkerCachePath = Path.join(Path.absolute('build/.tmp/cachedSources/renderer-worker'), rendererWorkerCacheHash)
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
    extraContents,
  )
  return hash
}

export const getExtensionHostWorkerCachePath = async (extraContents) => {
  const extensionHostWorkerCacheHash = await getExtensionHostWorkerCacheHash(extraContents)
  const extensionHostWorkerCachePath = Path.join(Path.absolute('build/.tmp/cachedSources/extension-host-worker'), extensionHostWorkerCacheHash)
  return extensionHostWorkerCachePath
}

export const getExtensionHostSubWorkerCachePath = async (extraContents) => {
  const extensionHostWorkerCacheHash = await getExtensionHostWorkerCacheHash(extraContents)
  const extensionHostWorkerCachePath = Path.join(Path.absolute('build/.tmp/cachedSources/extension-host-sub-worker'), extensionHostWorkerCacheHash)
  return extensionHostWorkerCachePath
}

export const getTestWorkerCachePath = async (extraContents) => {
  const testWorkerCacheHash = await getExtensionHostWorkerCacheHash(extraContents)
  const testWorkerCachePath = Path.join(Path.absolute('build/.tmp/cachedSources/test-worker'), testWorkerCacheHash)
  return testWorkerCachePath
}

const getMainProcessCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/main-process/src',
    [
      'build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'build/src/parts/BuildServer/BuildServer.js',
      'build/src/parts/BundleJs/BundleJs.js',
      'build/src/parts/BundleJsRollup/BundleJsRollup.js',
      'build/src/parts/CachePaths/CachePaths.js',
      'build/src/parts/BundleMainProcess/BundleMainProcess.js',
      'build/src/parts/BundleMainProcessCached/BundleMainProcessCached.js',
      'build/src/parts/BundleOptions/BundleOptions.js',
    ],
    extraContents,
  )
  return hash
}

export const getMainProcessCachePath = async (extraContents) => {
  const cacheHash = await getMainProcessCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('build/.tmp/cachedSources/main-process'), cacheHash)
  return cachePath
}

const getSharedProcessCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/shared-process/src',
    [
      'build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'build/src/parts/BuildServer/BuildServer.js',
      'build/src/parts/BundleJs/BundleJs.js',
      'build/src/parts/BundleJsRollup/BundleJsRollup.js',
      'build/src/parts/CachePaths/CachePaths.js',
      'build/src/parts/BundleSharedProcess/BundleSharedProcess.js',
      'build/src/parts/BundleSharedProcessCached/BundleSharedProcessCached.js',
      'build/src/parts/BundleSharedProcessDependencies/BundleSharedProcessDependencies.js',
      'build/src/parts/BundleOptions/BundleOptions.js',
    ],
    extraContents,
  )
  return hash
}

export const getSharedProcessCachePath = async (extraContents) => {
  const cacheHash = await getSharedProcessCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('build/.tmp/cachedSources/shared-process'), cacheHash)
  return cachePath
}
