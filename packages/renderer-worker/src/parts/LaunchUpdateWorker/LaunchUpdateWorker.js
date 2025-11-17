import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as UpdateWorkerUrl from '../UpdateWorkerUrl/UpdateWorkerUrl.js'

export const launchUpdateWorker = async () => {
  const name = 'Update Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.updateWorkerPath', UpdateWorkerUrl.updateWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
