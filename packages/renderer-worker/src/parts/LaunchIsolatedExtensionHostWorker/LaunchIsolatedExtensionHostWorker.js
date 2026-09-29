import * as ContentSecurityPolicy from '../ContentSecurityPolicy/ContentSecurityPolicy.js'
import * as GetExtensionWorkerMemoryUsage from '../GetExtensionWorkerMemoryUsage/GetExtensionWorkerMemoryUsage.js'
import * as Id from '../Id/Id.js'
import * as IpcTrace from '../IpcTrace/IpcTrace.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'

const workers = new Map()

const assertCurrent = (extensionId, worker) => {
  if (workers.get(extensionId) !== worker) {
    throw new Error(`Extension worker launch canceled: ${extensionId}`)
  }
}

export const launchIsolatedExtensionHostWorker = async (port, extensionId, url, workerName = '', contentSecurityPolicy = '') => {
  if (workers.has(extensionId)) {
    throw new Error(`Extension worker already exists: ${extensionId}`)
  }
  const suffix = extensionId ? `: ${extensionId}` : ''
  const fallbackName = Platform.getPlatform() === PlatformType.Electron ? `Extension API (Electron)${suffix}` : `Extension API${suffix}`
  const name = workerName || fallbackName
  const id = Id.create()
  const worker = { id, url, starting: false }
  workers.set(extensionId, worker)
  try {
    if (contentSecurityPolicy) {
      const pathName = new URL(url, 'http://localhost').pathname
      await ContentSecurityPolicy.set(pathName, contentSecurityPolicy)
    }
    assertCurrent(extensionId, worker)
    const workerPort = await IpcTrace.maybeCreateProxy({
      id,
      name,
      port,
      traceId: extensionId,
    })
    if (workers.get(extensionId) !== worker) {
      workerPort.close?.()
      assertCurrent(extensionId, worker)
    }
    worker.starting = true
    await RendererProcess.invokeAndTransfer('IpcParent.create', {
      method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
      name,
      port: workerPort,
      raw: true,
      url,
      id,
    })
    assertCurrent(extensionId, worker)
  } catch (error) {
    if (workers.get(extensionId) === worker) {
      workers.delete(extensionId)
    }
    port.close?.()
    if (worker.starting) {
      // Creation can finish after disposal; only terminate this launch's numeric
      // id, never a replacement that happens to share the extension id.
      await RendererProcess.invoke('IpcParent.dispose', id)
    }
    throw error
  }
}

export const getMemoryUsage = async (extensionId) => {
  const workerUrl = workers.get(extensionId)?.url
  if (typeof workerUrl !== 'string') {
    return 0
  }
  const measurement = await RendererProcess.invoke('Performance.measureUserAgentSpecificMemory')
  return GetExtensionWorkerMemoryUsage.getExtensionWorkerMemoryUsage(measurement, workerUrl)
}

export const disposeIsolatedExtensionHostWorker = async (extensionId) => {
  const worker = workers.get(extensionId)
  if (!worker) {
    return
  }
  workers.delete(extensionId)
  if (worker.starting) {
    await RendererProcess.invoke('IpcParent.dispose', worker.id)
  }
}

export const clear = () => {
  workers.clear()
}
