import * as FileSearchWorkerUrl from '../FileSearchWorkerUrl/FileSearchWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const launchFileSearchWorker = async () => {
  const name = 'File Search Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.fileSearchWorkerPath', FileSearchWorkerUrl.fileSearchWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  try {
    await JsonRpc.invoke(ipc, 'QuickPick.initialize')
  } catch {
    // ignore
  }
  return ipc
}
