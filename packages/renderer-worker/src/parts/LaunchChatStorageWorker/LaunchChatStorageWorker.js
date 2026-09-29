import * as ChatStorageWorkerUrl from '../ChatStorageWorkerUrl/ChatStorageWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchChatStorageWorker = async () => {
  const name = 'Chat Storage Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.chatStorageWorkerPath', ChatStorageWorkerUrl.chatStorageWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
