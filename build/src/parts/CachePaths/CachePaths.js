import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'

const getRendererProcessCacheHash = async () => {
  const hash = await Hash.computeFolderHash('packages/renderer-process/src', [
    'build/src/parts/BundleElectronApp/BundleElectronApp.js',
    'build/src/parts/BuildServer/BuildServer.js',
    'build/src/parts/BundleJs/BundleJs.js',
    'build/src/parts/BundleRendererProcess/BundleRendererProcess.js',
  ])
  return hash
}

export const getRendererProcessCachePath = async () => {
  const rendererProcessCacheHash = await getRendererProcessCacheHash()
  const rendererProcessCachePath = Path.join(
    Path.absolute('build/.tmp/cachedSources/renderer-process'),
    rendererProcessCacheHash
  )
  return rendererProcessCachePath
}

const getRendererWorkerCacheHash = async () => {
  const hash = await Hash.computeFolderHash('packages/renderer-worker/src', [
    'build/src/parts/BundleElectronApp/BundleElectronApp.js',
    'build/src/parts/BuildServer/BuildServer.js',
    'build/src/parts/BundleJs/BundleJs.js',
    'build/src/parts/BundleRendererWorker/BundleRendererWorker.js',
  ])
  return hash
}

export const getRendererWorkerCachePath = async () => {
  const rendererWorkerCacheHash = await getRendererWorkerCacheHash()
  const rendererWorkerCachePath = Path.join(
    Path.absolute('build/.tmp/cachedSources/renderer-worker'),
    rendererWorkerCacheHash
  )
  return rendererWorkerCachePath
}
