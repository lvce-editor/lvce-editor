import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'

const getRendererProcessCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/renderer-worker/node_modules/@lvce-editor/renderer-process/dist',
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
    'packages/build/src',
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

export const getKeyBindingsViewWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/keybindings-view-worker'), hash)
  return cachePath
}

export const getAboutViewWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/about-view-worker'), hash)
  return cachePath
}

export const getTitleBarWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/title-bar-worker'), hash)
  return cachePath
}

export const getMarkdownWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/markdown-worker'), hash)
  return cachePath
}

export const getSearchWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/search-worker'), hash)
  return cachePath
}

export const getSyntaxHighlightingWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/syntax-highlighting-worker'), hash)
  return cachePath
}

export const getIframeWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/iframe-worker'), hash)
  return cachePath
}

export const getRenameWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/rename-worker'), hash)
  return cachePath
}

export const getColorPickerWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/color-picker-worker'), hash)
  return cachePath
}
export const getSourceControlWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/source-control-worker'), hash)
  return cachePath
}

export const getDebugWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/debug-worker'), hash)
  return cachePath
}

export const getFileSearchWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/file-search-worker'), hash)
  return cachePath
}

export const getIframeInspectorWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/iframe-inspector'), hash)
  return cachePath
}

export const getTextSearchWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/text-search-worker'), hash)
  return cachePath
}

export const getExtensionSearchViewWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/extension-search-view-worker'), hash)
  return cachePath
}

export const getExtensionDetailViewWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/extension-detail-view-worker'), hash)
  return cachePath
}

export const getEmbedsWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/embeds-worker'), hash)
  return cachePath
}

export const getEditorWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/editor-worker'), hash)
  return cachePath
}

export const getErrorWorkerCachePath = async (extraContents) => {
  const hash = await getExtensionHostWorkerCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/error-worker'), hash)
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

const getTypeScriptCompileProcessCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/typescript-compile-process/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/BundleJsRollup/BundleJsRollup.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundleTypeScriptCompileProcess/BundleTypeScriptCompileProcess.js',
      'packages/build/src/parts/BundleTypeScriptCompileProcessCached/BundleTypeScriptCompileProcessCached.js',
      'packages/build/src/parts/BundleTypeScriptCompileProcessDependencies/BundleTypeScriptCompileProcessDependencies.js',
      'packages/build/src/parts/BundleOptions/BundleOptions.js',
    ],
    extraContents,
  )
  return hash
}

export const getTypeScriptCompileProcessCachePath = async (extraContents) => {
  const cacheHash = await getTypeScriptCompileProcessCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/typescript-compile-process'), cacheHash)
  return cachePath
}

const getSearchProcessCacheHash = async (extraContents) => {
  const hash = await Hash.computeFolderHash(
    'packages/search-process/src',
    [
      'packages/build/src/parts/BundleElectronApp/BundleElectronApp.js',
      'packages/build/src/parts/BuildServer/BuildServer.js',
      'packages/build/src/parts/BundleJs/BundleJs.js',
      'packages/build/src/parts/BundleJsRollup/BundleJsRollup.js',
      'packages/build/src/parts/CachePaths/CachePaths.js',
      'packages/build/src/parts/BundleSearchProcess/BundleSearchProcess.js',
      'packages/build/src/parts/BundleSearchProcessCached/BundleSearchProcessCached.js',
      'packages/build/src/parts/BundleSearchProcessDependencies/BundleSearchProcessDependencies.js',
      'packages/build/src/parts/BundleOptions/BundleOptions.js',
    ],
    extraContents,
  )
  return hash
}

export const getSearchProcessCachePath = async (extraContents) => {
  const cacheHash = await getSearchProcessCacheHash(extraContents)
  const cachePath = Path.join(Path.absolute('packages/build/.tmp/cachedSources/search-process'), cacheHash)
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
