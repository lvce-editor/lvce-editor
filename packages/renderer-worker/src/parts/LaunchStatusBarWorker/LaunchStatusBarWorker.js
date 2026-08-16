import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as ExtensionManagementRpcId from '../ExtensionManagementRpcId/ExtensionManagementRpcId.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as StatusBarWorkerUrl from '../StatusBarWorkerUrl/StatusBarWorkerUrl.js'

export const launchStatusBarWorker = async () => {
  const name = 'Status Bar Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.statusBarWorkerPath', StatusBarWorkerUrl.statusBarWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = new MessageChannel()
  await Promise.all([
    ExtensionManagementWorker.invokeAndTransfer('Extensions.handleMessagePort', port1, ExtensionManagementRpcId.StatusBarWorker),
    JsonRpc.invokeAndTransfer(ipc, 'StatusBar.handleExtensionManagementMessagePort', port2),
  ])
  const { port1: rendererWorkerPort, port2: rendererProcessPort } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'StatusBar.handleMessagePort', rendererWorkerPort),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', rendererProcessPort, 'StatusBar'),
  ])
  return ipc
}
