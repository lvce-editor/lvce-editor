import * as ClipBoardProcessPath from '../ClipBoardProcessPath/ClipBoardProcessPath.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'

export const launchClipBoardProcess = async () => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'ClipBoard Process',
    targetRpcId: IpcId.ClipBoardProcess,
    defaultPath: ClipBoardProcessPath.clipBoardProcessPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.clipBoardProcessPath',
  })
  return ipc
}
