import * as EditorWorkerUrl from '../EditorWorkerUrl/EditorWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('developer.editorWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || EditorWorkerUrl.editorWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = EditorWorkerUrl.editorWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchEditorWorker = async () => {
  const configuredWorkerUrl = getConfiguredWorkerUrl()
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Editor Worker',
  })
  HandleIpc.handleIpc(ipc)
  const syntaxHighlightingWorker = true
  const syncIncremental = true
  await JsonRpc.invoke(ipc, 'Initialize.initialize', syntaxHighlightingWorker, syncIncremental)
  return ipc
}
