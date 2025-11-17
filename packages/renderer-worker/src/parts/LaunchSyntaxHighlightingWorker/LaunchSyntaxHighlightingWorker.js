import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IpcState from '../IpcState/IpcState.js'
import * as SyntaxHighlightingWorkerUrl from '../SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as Id from '../Id/Id.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug from '../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'

export const launchSyntaxHighlightingWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
    'developer.syntaxHighlightingWorkerPath',
    SyntaxHighlightingWorkerUrl.syntaxHighlightingWorkerUrl,
  )
  const name = 'Syntax Highlighting Worker'
  const id = Id.create()
  let ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: configuredWorkerUrl,
    id,
  })
  if (IpcState.getConfig()) {
    // TODO should renderer process send port to renderer worker or vice versa?
    const port = Transferrable.acquire(id)
    ipc = IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(port)
  }
  HandleIpc.handleIpc(ipc)
  return ipc
}
