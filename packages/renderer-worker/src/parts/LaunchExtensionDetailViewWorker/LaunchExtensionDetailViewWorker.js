import * as ExtensionDetailViewWorkerUrl from '../ExtensionDetailViewWorkerUrl/ExtensionDetailViewWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchExtensionDetailViewWorker = async () => {
  const name = 'Extension Detail View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
      'develop.extensionDetailViewWorkerPath',
      ExtensionDetailViewWorkerUrl.extensionDetailViewWorkerUrl,
    ),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'ExtensionDetail.initialize')
  return ipc
}
