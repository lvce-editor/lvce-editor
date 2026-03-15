import * as ChatCoordinatorWorkerUrl from '../ChatCoordinatorWorkerUrl/ChatCoordinatorWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchChatCoordinatorWorker = async () => {
  const name = 'Chat Coordinator Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.chatCoordinatorWorkerPath', ChatCoordinatorWorkerUrl.chatCoordinatorWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
