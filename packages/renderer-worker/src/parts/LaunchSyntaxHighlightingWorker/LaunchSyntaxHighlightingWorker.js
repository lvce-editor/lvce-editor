import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as IpcState from '../IpcState/IpcState.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SyntaxHighlightingWorkerUrl from '../SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as Id from '../Id/Id.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('developer.syntaxHighlightingWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || SyntaxHighlightingWorkerUrl.syntaxHighlightingWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = SyntaxHighlightingWorkerUrl.syntaxHighlightingWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchSyntaxHighlightingWorker = async () => {
  const configuredWorkerUrl = getConfiguredWorkerUrl()
  const name = 'Syntax Highlighting Worker'
  const id = Id.create()
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: configuredWorkerUrl,
    id,
  })
  console.log('after syn')
  if (IpcState.getConfig()) {
    // TODO should renderer process send port to renderer worker or vice versa?
    const port = Transferrable.acquire(id)
    // TODO wrap port to create ipc
    console.log({ port })
  }
  HandleIpc.handleIpc(ipc)
  return ipc
}
