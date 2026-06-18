import * as ActivityBarWorkerUrl from '../ActivityBarWorkerUrl/ActivityBarWorkerUrl.js'
import * as ExtensionManagementRpcId from '../ExtensionManagementRpcId/ExtensionManagementRpcId.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const launchActivityBarWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
    'develop.activityBarWorkerPath',
    ActivityBarWorkerUrl.activityBarWorkerUrl,
  )
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Activity Bar Worker',
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = new MessageChannel()
  void Promise.all([
    ExtensionManagementWorker.invokeAndTransfer('Extensions.handleMessagePort', port1, ExtensionManagementRpcId.ActivityBarWorker),
    JsonRpc.invokeAndTransfer(ipc, 'ActivityBar.handleExtensionManagementMessagePort', port2),
  ]).catch(console.error)
  return ipc
}
