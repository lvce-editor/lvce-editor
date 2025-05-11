import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SimpleBrowserWorkerUrl from '../SimpleBrowserWorkerUrl/SimpleBrowserWorkerUrl.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.simpleBrowserWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || SimpleBrowserWorkerUrl.simpleBrowserWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = SimpleBrowserWorkerUrl.simpleBrowserWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchSimpleBrowserWorker = async () => {
  const name = 'Simple Browser Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
