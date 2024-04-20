import * as DiffWorkerUrl from '../DiffWorkerUrl/DiffWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchDiffWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: DiffWorkerUrl.diffWorkerUrl,
    name: 'Diff Worker',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
