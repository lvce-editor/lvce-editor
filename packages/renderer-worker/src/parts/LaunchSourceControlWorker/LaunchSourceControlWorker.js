import * as SourceControlWorkerUrl from '../SourceControlWorkerUrl/SourceControlWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.sourceControlWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || SourceControlWorkerUrl.sourceControlWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = SourceControlWorkerUrl.sourceControlWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchSourceControlWorker = async () => {
  const name = 'Source Control Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Initialize.initialize')
  return ipc
}
