import * as ChatMathWorkerUrl from '../ChatMathWorkerUrl/ChatMathWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchChatMathWorker = async () => {
  const name = 'Chat Math Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.chatMathWorkerPath', ChatMathWorkerUrl.chatMathWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
