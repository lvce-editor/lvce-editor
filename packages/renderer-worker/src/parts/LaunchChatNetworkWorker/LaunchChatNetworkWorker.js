import * as ChatNetworkWorkerUrl from '../ChatNetworkWorkerUrl/ChatNetworkWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchChatNetworkWorker = async () => {
  const name = 'Chat Network Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.chatNetworkWorkerPath', ChatNetworkWorkerUrl.chatNetworkWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
