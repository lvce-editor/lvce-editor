import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as ReferencesWorkerUrl from '../ReferencesWorkerUrl/ReferencesWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchReferencesWorker = async () => {
  const name = 'References Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.referencesWorkerPath', ReferencesWorkerUrl.referencesWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'References.initialize')
  return ipc
}
