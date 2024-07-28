import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SyntaxHighlightingWorkerUrl from '../SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.js'

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
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: configuredWorkerUrl,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
