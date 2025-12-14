import * as ExtensionManagementWorkerUrl from '../ExtensionManagementWorkerUrl/ExtensionManagementWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const launchExtensionManagementWorker = async () => {
  const name = 'Extension Management Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
      'develop.extensionManagementWorkerPath',
      ExtensionManagementWorkerUrl.extensionManagementWorkerUrl,
    ),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Extensions.initialize')
  return ipc
}
