import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SettingsWorkerUrl from '../SettingsWorkerUrl/SettingsWorkerUrl.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.settingsWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || SettingsWorkerUrl.settingsWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = SettingsWorkerUrl.settingsWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchSettingsWorker = async () => {
  const name = 'Settings Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Initialize.initialize')
  return ipc
}
