import * as ExtensionDetailViewWorkerUrl from '../ExtensionDetailViewWorkerUrl/ExtensionDetailViewWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.extensionDetailViewWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || ExtensionDetailViewWorkerUrl.extensionDetailViewWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = ExtensionDetailViewWorkerUrl.extensionDetailViewWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchExtensionDetailViewWorker = async () => {
  const name = 'Extension Detail View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke('ExtensionDetail.initialize')
  return ipc
}
