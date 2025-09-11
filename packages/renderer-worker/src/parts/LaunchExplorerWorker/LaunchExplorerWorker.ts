import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as ExplorerWorkerUrl from '../ExplorerWorkerUrl/ExplorerWorkerUrl.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const launchExplorerWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.explorerWorkerPath', ExplorerWorkerUrl.explorerWorkerUrl)
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Explorer Worker',
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Explorer.initialize')
  return ipc
}
