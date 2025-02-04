import * as FileWatcherProcessPath from '../FileWatcherProcessPath/FileWatcherProcessPath.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'

export const launchFileWatcherProcess = async () => {
  const method = IsElectron.isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const ipc = await IpcParent.create({
    method,
    path: FileWatcherProcessPath.fileWatcherProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'File Watcher Process',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
