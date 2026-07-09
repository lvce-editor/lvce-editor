import * as FileWatcherProcessPath from '../FileWatcherProcessPath/FileWatcherProcessPath.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'

export const launchFileWatcherProcess = async () => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'File Watcher Process',
    settingName: 'develop.fileWatcherProcessPath',
    defaultPath: FileWatcherProcessPath.fileWatcherProcessPath,
    isElectron: IsElectron.isElectron,
    targetRpcId: IpcId.FileWatcherProcess,
  })
  return ipc
}
