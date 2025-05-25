import * as FileWatcherProcessPath from '../FileWatcherProcessPath/FileWatcherProcessPath.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'

export const launchFileWatcherProcess = async () => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'File Watcher Process',
    settingName: '',
    defaultPath: FileWatcherProcessPath.fileWatcherProcessPath,
    isElectron: IsElectron.isElectron,
    targetRpcId: IpcId.FileWatcherProcess,
  })
  return ipc
}
