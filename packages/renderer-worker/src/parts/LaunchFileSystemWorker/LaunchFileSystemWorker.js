import * as FileSystemWorkerUrl from '../FileSystemWorkerUrl/FileSystemWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.fileSystemWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || FileSystemWorkerUrl.fileSystemWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = FileSystemWorkerUrl.fileSystemWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchFileSystemWorker = async () => {
  const name = 'File System Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
