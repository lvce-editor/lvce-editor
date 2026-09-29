import * as ChatViewModelWorkerUrl from '../ChatViewModelWorkerUrl/ChatViewModelWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchChatViewModelWorker = async () => {
  const name = 'Chat View Model Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.chatViewModelWorkerPath', ChatViewModelWorkerUrl.chatViewModelWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
