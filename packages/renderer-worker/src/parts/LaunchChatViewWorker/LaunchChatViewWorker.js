import * as ChatViewWorkerUrl from '../ChatViewWorkerUrl/ChatViewWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchChatViewWorker = async () => {
  const name = 'Chat View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.chatViewWorkerPath', ChatViewWorkerUrl.chatViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
