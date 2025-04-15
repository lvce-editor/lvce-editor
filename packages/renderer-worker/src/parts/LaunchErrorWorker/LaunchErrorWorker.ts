import * as ErrorWorkerUrl from '../ErrorWorkerUrl/ErrorWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchErrorWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: ErrorWorkerUrl.errorWorkerUrl,
    name: 'Error Worker',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
