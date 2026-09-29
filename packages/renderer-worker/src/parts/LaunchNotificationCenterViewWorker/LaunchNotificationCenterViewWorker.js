import * as ExtensionManagementRpcId from '../ExtensionManagementRpcId/ExtensionManagementRpcId.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as NotificationCenterViewWorkerUrl from '../NotificationCenterViewWorkerUrl/NotificationCenterViewWorkerUrl.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const launchNotificationCenterViewWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Notification Center View Worker',
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
      'develop.notificationCenterViewWorkerPath',
      NotificationCenterViewWorkerUrl.notificationCenterViewWorkerUrl,
    ),
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = new MessageChannel()
  await Promise.all([
    ExtensionManagementWorker.invokeAndTransfer('Extensions.handleMessagePort', port1, ExtensionManagementRpcId.NotificationCenterWorker),
    JsonRpc.invokeAndTransfer(ipc, 'NotificationCenter.handleExtensionManagementMessagePort', port2),
  ])
  const { port1: rendererWorkerPort, port2: rendererProcessPort } = new MessageChannel()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'NotificationCenter.handleMessagePort', rendererWorkerPort),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', rendererProcessPort, 'NotificationCenter'),
  ])
  return ipc
}
