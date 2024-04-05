import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'

const getRendererProcessCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/renderer-process/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundleRendererProcess/BundleRendererProcess.js',
      'packages/build/src/parts/BundleRendererProcessCached/BundleRendererProcessCached.js',
    ],
    extraContents,
  )
  return hash
}

export const getRendererProcessCachePath = async (extraContents) => {
  const rendererProcessCacheHash = await getRendererProcessCacheHash(extraContents)
  const rendererProcessCachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/renderer-process'), rendererProcessCacheHash)
  return rendererProcessCachePath
}

const getRendererWorkerCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/renderer-worker/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundleRendererWorker/BundleRendererWorker.js',
      'packages/build/src/parts/BundleRendererWorkerCached/BundleRendererWorkerCached.js',
      'packages/build/src/parts/EagerLoadedCss/EagerLoadedCss.js',
      'packages/build/src/parts/GetCssDeclarationFiles/GetCssDeclarationFiles.js',
    ],
    extraContents,
  )
  return hash
}

export const getRendererWorkerCachePath = async (extraContents) => {
  const rendererWorkerCacheHash = await getRendererWorkerCacheHash(extraContents)
  const rendererWorkerCachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/renderer-worker'), rendererWorkerCacheHash)
  return rendererWorkerCachePath
}

const getExtensionHostWorkerCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/extension-host-worker/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundleRendererWorker/BundleRendererWorker.js',
      'packages/build/src/parts/BundleRendererWorkerCached/BundleRendererWorkerCached.js',
    ],
    extraContents,
  )
  return hash
}

export const getExtensionHostWorkerCachePath = async (extraContents) => {
  const extensionHostWorkerCacheHash = await getExtensionHostWorkerCacheHash(extraContents)
  const extensionHostWorkerCachePath = Path.join(
    Path.absolute('packages/build/.tmp/cachedSources/extension-host-worker'),
    extensionHostWorkerCacheHash,
  )
  return extensionHostWorkerCachePath
}

export const getTerminalWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/terminal-worker'), hash)
  return cachePath
}

export const getEmbedsWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/embeds-worker'), hash)
  return cachePath
}

export const getExtensionHostSubWorkerCachePath = async (extraContents) => {
  const extensionHostWorkerCacheHash = await getExtensionHostWorkerCacheHash(extraContents)
  const extensionHostWorkerCachePath = Path.join(
    Path.absolute('packages/build/.tmp/cachedSources/extension-host-sub-worker'),
    extensionHostWorkerCacheHash,
  )
  return extensionHostWorkerCachePath
}

export const getTestWorkerCachePath = async (extraContents) => {
  const testWorkerCacheHash = await getExtensionHostWorkerCacheHash(extraContents)
  const testWorkerCachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/test-worker'), testWorkerCacheHash)
  return testWorkerCachePath
}

const getMainProcessCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/main-process/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/BundleJsRollup/BundleJsRollup.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundleMainProcess/BundleMainProcess.js',
      'packages/build/src/parts/BundleMainProcessCached/BundleMainProcessCached.js',
      'packages/build/src/parts/BundleOptions/BundleOptions.js',
    ],
    extraContents,
  )
  return hash
}

export const getMainProcessCachePath = async (extraContents) => {
  const cacheHash = await getMainProcessCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/main-process'), cacheHash)
  return cachePath
}

const getSharedProcessCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/shared-process/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/BundleJsRollup/BundleJsRollup.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundleSharedProcess/BundleSharedProcess.js',
      'packages/build/src/parts/BundleSharedProcessCached/BundleSharedProcessCached.js',
      'packages/build/src/parts/BundleSharedProcessDependencies/BundleSharedProcessDependencies.js',
      'packages/build/src/parts/BundleOptions/BundleOptions.js',
    ],
    extraContents,
  )
  return hash
}

export const getSharedProcessCachePath = async (extraContents) => {
  const cacheHash = await getSharedProcessCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/shared-process'), cacheHash)
  return cachePath
}
