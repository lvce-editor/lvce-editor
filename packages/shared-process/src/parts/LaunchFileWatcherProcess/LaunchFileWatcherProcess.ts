import * as FileWatcherProcessPath from '../FileWatcherProcessPath/FileWatcherProcessPath.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'

export const launchFileWatcherProcess = async (): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    defaultPath: FileWatcherProcessPath.fileWatcherProcessPath,
    isElectron: IsElectron.isElectron,
    name: 'File Watcher Process',
    settingName: 'develop.fileWatcherProcessPath',
    targetRpcId: IpcId.FileWatcherProcess,
  })
  return ipc
}
