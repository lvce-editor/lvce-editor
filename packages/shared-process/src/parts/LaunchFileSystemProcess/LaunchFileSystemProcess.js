import * as FileSystemProcessPath from '../FileSystemProcessPath/FileSystemProcessPath.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredUrl = async () => {
  const preferences = await Preferences.getUserPreferences()
  const customPreviewProcessPath = preferences['develop.fileSystemProcessPath']
  let previewProcessPath = customPreviewProcessPath || FileSystemProcessPath.fileSystemProcessPath
  if (IsProduction.isProduction) {
    previewProcessPath = FileSystemProcessPath.fileSystemProcessPath
  }
  return previewProcessPath
}

export const launchFileSystemProcess = async () => {
  const method = IsElectron.isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const fileSystemProcessPath = await getConfiguredUrl()
  const fileSystemProcess = await IpcParent.create({
    method,
    path: fileSystemProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'File System Process',
    ipcId: IpcId.SharedProcess,
    targetRpcId: IpcId.FileSystemProcess,
  })
  HandleIpc.handleIpc(fileSystemProcess)
  return fileSystemProcess
}
