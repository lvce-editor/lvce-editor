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

export const getSyntaxHighlightingWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/syntax-highlighting-worker'), hash)
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

const getPtyHostCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/pty-host/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/BundleJsRollup/BundleJsRollup.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundlePtyHost/BundlePtyHost.js',
      'packages/build/src/parts/BundlePtyHostCached/BundlePtyHostCached.js',
      'packages/build/src/parts/BundlePtyHostDependencies/BundlePtyHostDependencies.js',
      'packages/build/src/parts/BundleOptions/BundleOptions.js',
    ],
    extraContents,
  )
  return hash
}

export const getPtyHostCachePath = async (extraContents) => {
  const cacheHash = await getPtyHostCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/pty-host'), cacheHash)
  return cachePath
}

const getEmbedsProcessCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/embeds-process/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/BundleJsRollup/BundleJsRollup.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundleEmbedsProcess/BundleEmbedsProcess.js',
      'packages/build/src/parts/BundleEmbedsProcessCached/BundleEmbedsProcessCached.js',
      'packages/build/src/parts/BundleEmbedsProcessDependencies/BundleEmbedsProcessDependencies.js',
      'packages/build/src/parts/BundleOptions/BundleOptions.js',
    ],
    extraContents,
  )
  return hash
}

export const getEmbedsProcessCachePath = async (extraContents) => {
  const cacheHash = await getEmbedsProcessCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/embeds-process'), cacheHash)
  return cachePath
}

const getProcessExplorerCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/process-explorer/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/BundleJsRollup/BundleJsRollup.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundleProcessExplorer/BundleProcessExplorer.js',
      'packages/build/src/parts/BundleProcessExplorerCached/BundleProcessExplorerCached.js',
      'packages/build/src/parts/BundleProcessExplorerDependencies/BundleProcessExplorerDependencies.js',
      'packages/build/src/parts/BundleOptions/BundleOptions.js',
    ],
    extraContents,
  )
  return hash
}

export const getProcessExplorerCachePath = async (extraContents) => {
  const cacheHash = await getProcessExplorerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/process-explorer'), cacheHash)
  return cachePath
}

const getPreloadCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/preload/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/BundleJsRollup/BundleJsRollup.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundleProcessExplorer/BundleProcessExplorer.js',
      'packages/build/src/parts/BundleProcessExplorerCached/BundleProcessExplorerCached.js',
      'packages/build/src/parts/BundleProcessExplorerDependencies/BundleProcessExplorerDependencies.js',
      'packages/build/src/parts/BundleOptions/BundleOptions.js',
    ],
    extraContents,
  )
  return hash
}

export const getPreloadCachePath = async (extraContents) => {
  const cacheHash = await getPreloadCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/preload'), cacheHash)
  return cachePath
}
