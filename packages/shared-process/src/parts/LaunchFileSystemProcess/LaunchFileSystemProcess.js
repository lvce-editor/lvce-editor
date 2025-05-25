import * as FileSystemProcessPath from '../FileSystemProcessPath/FileSystemProcessPath.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'

export const launchFileSystemProcess = async () => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'File System Process',
    targetRpcId: IpcId.FileSystemProcess,
    defaultPath: FileSystemProcessPath.fileSystemProcessPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.fileSystemProcessPath',
  })
  return ipc
}
