import * as FileSystemProcessPath from '../FileSystemProcessPath/FileSystemProcessPath.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'

export const launchFileSystemProcess = async () => {
  const method = IsElectron.isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const fileSystemProcess = await IpcParent.create({
    method,
    path: FileSystemProcessPath.fileSystemProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'File System Process',
  })
  HandleIpc.handleIpc(fileSystemProcess)
  return fileSystemProcess
}
