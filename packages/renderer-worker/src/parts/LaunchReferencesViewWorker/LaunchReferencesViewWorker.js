import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as ReferencesWorkerUrl from '../ReferencesWorkerUrl/ReferencesWorkerUrl.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.referencesWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || ReferencesWorkerUrl.referencesWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = ReferencesWorkerUrl.referencesWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchReferencesWorker = async () => {
  const name = 'References Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'References.initialize')
  return ipc
}
