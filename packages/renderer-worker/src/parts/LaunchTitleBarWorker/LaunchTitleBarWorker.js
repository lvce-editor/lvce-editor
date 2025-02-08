import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TitleBarWorkerUrl from '../TitleBarWorkerUrl/TitleBarWorkerUrl.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.titleBarWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || TitleBarWorkerUrl.titleBarWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = TitleBarWorkerUrl.titleBarWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchTitleBarWorker = async () => {
  const name = 'Title Bar Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
