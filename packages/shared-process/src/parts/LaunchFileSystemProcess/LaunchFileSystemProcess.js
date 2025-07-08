import { set } from '@lvce-editor/rpc-registry'
import * as FileSystemProcessPath from '../FileSystemProcessPath/FileSystemProcessPath.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'

export const launchFileSystemProcess = async () => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'File System Process',
    targetRpcId: IpcId.FileSystemProcess,
    defaultPath: FileSystemProcessPath.fileSystemProcessPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.fileSystemProcessPath',
  })
  // @ts-ignore
  set(IpcId.FileSystemProcess, ipc)
  // TODO call initialize function, but file system process should create connection to main process
  // TODO maybe call initialize function as part of rpc setup?
  await JsonRpc.invoke(ipc, 'Initialize.initialize')
  return ipc
}
