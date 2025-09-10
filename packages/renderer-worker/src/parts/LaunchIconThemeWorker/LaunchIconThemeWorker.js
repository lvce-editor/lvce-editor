import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IconThemeWorkerUrl from '../IconThemeWorkerUrl/IconThemeWorkerUrl.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.iconThemeWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || IconThemeWorkerUrl.iconThemeWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = IconThemeWorkerUrl.iconThemeWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchAboutViewWorker = async () => {
  const name = 'Icon Theme Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
