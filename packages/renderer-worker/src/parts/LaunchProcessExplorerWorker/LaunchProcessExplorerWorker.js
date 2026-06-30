import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as ProcessExplorerWorkerUrl from '../ProcessExplorerWorkerUrl/ProcessExplorerWorkerUrl.js'

export const launchProcessExplorerWorker = async () => {
  const name = 'Process Explorer Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.processExplorerWorkerPath', ProcessExplorerWorkerUrl.processExplorerWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
