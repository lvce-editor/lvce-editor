import * as ExtensionSearchViewWorkerUrl from '../ExtensionSearchViewWorkerUrl/ExtensionSearchViewWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const launchExtensionSearchViewWorker = async () => {
  const name = Platform.getPlatform() === PlatformType.Electron ? 'Extension Search View Worker (Electron)' : 'Extension Search View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
      'develop.extensionSearchViewWorkerPath',
      ExtensionSearchViewWorkerUrl.extensionSearchViewWorkerUrl,
    ),
  })
  HandleIpc.handleIpc(ipc)
  try {
    await JsonRpc.invoke(ipc, 'SearchExtensions.initialize')
  } catch {
    // ignore
  }
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'SearchExtensions.handleMessagePort', port1),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', port2),
  ])
  return ipc
}
