import * as ContentSecurityPolicy from '../ContentSecurityPolicy/ContentSecurityPolicy.js'
import * as Id from '../Id/Id.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'

const workerIds = Object.create(null)

export const launchIsolatedExtensionHostWorker = async (port, extensionId, url, workerName = '', contentSecurityPolicy = '') => {
  const suffix = extensionId ? `: ${extensionId}` : ''
  const fallbackName = Platform.getPlatform() === PlatformType.Electron ? `Extension API (Electron)${suffix}` : `Extension API${suffix}`
  const name = workerName || fallbackName
  const id = Id.create()
  if (contentSecurityPolicy) {
    const pathName = new URL(url, 'http://localhost').pathname
    await ContentSecurityPolicy.set(pathName, contentSecurityPolicy)
  }
  await RendererProcess.invokeAndTransfer('IpcParent.create', {
    method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
    name,
    port,
    raw: true,
    url,
    id,
  })
  workerIds[extensionId] = id
}

export const disposeIsolatedExtensionHostWorker = async (extensionId) => {
  const id = workerIds[extensionId]
  if (typeof id !== 'number') {
    return
  }
  delete workerIds[extensionId]
  await RendererProcess.invoke('IpcParent.dispose', id)
}

export const clear = () => {
  for (const extensionId of Object.keys(workerIds)) {
    delete workerIds[extensionId]
  }
}
