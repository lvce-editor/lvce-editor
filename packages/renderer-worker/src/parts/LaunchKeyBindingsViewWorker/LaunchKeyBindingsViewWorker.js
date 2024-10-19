import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as KeyBindingsViewWorkerUrl from '../KeyBindingsViewWorkerUrl/KeyBindingsViewWorkerUrl.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.keyBindingsViewWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || KeyBindingsViewWorkerUrl.keyBindingsViewWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = KeyBindingsViewWorkerUrl.keyBindingsViewWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchKeyBindingsViewWorker = async () => {
  const name = 'KeyBindings View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
