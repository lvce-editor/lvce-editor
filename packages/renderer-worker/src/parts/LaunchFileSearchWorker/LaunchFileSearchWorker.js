import * as FileSearchWorkerUrl from '../FileSearchWorkerUrl/FileSearchWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.fileSearchWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || FileSearchWorkerUrl.fileSearchWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = FileSearchWorkerUrl.fileSearchWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchFileSearchWorker = async () => {
  const name = 'File Search Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
