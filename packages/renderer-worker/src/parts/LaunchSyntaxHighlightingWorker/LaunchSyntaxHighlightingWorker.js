import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as SyntaxHighlightingWorkerUrl from '../SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.js'

export const launchSyntaxHighlightingWorker = async () => {
  const name =  'Syntax Highlighting Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: SyntaxHighlightingWorkerUrl.syntaxHighlightingWorkerUrl,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
