import * as DiffViewWorkerUrl from '../DiffViewWorkerUrl/DiffViewWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const launchDiffViewWorker = async () => {
  const name = 'Diff View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.diffViewWorkerPath', DiffViewWorkerUrl.diffViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'DiffView.initialize')
  return ipc
}
