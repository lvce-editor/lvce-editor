import { chatDebugViewWorkerUrl } from '../ChatDebugViewWorkerUrl/ChatDebugViewWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchChatDebugViewWorker = async () => {
  const name = 'Chat Debug View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.chatDebugViewWorkerPath', chatDebugViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
