import * as FileWatcherExplorerPath from '../FileWatcherExplorerPath/FileWatcherExplorerPath.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'

export const launchFileWatcherExplorer = async (): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    defaultPath: FileWatcherExplorerPath.fileWatcherExplorerPath,
    isElectron: IsElectron.isElectron,
    name: 'File Watcher Explorer',
    settingName: 'develop.fileWatcherExplorerPath',
    targetRpcId: IpcId.FileWatcherExplorer,
  })
  HandleIpc.unhandleIpc(ipc)
  return ipc
}
