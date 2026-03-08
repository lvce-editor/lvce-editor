import * as ChatToolWorkerUrl from '../ChatToolWorkerUrl/ChatToolWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchChatToolWorker = async () => {
  const name = 'Chat Tool Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.chatToolWorkerPath', ChatToolWorkerUrl.chatToolWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
