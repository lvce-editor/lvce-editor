import * as FileSearchWorkerUrl from '../FileSearchWorkerUrl/FileSearchWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchFileSearchWorker = async () => {
  const name = 'File Search Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: FileSearchWorkerUrl.fileSearchWorkerUrl,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
