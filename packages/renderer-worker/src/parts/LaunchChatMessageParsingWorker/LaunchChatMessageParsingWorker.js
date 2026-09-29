import * as ChatMessageParsingWorkerUrl from '../ChatMessageParsingWorkerUrl/ChatMessageParsingWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchChatMessageParsingWorker = async () => {
  const name = 'Chat Message Parsing Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.chatMessageParsingWorkerPath', ChatMessageParsingWorkerUrl.chatMessageParsingWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
