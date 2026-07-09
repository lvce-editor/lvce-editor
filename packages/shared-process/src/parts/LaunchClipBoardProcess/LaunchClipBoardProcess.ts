import * as ClipBoardProcessPath from '../ClipBoardProcessPath/ClipBoardProcessPath.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'

export const launchClipBoardProcess = async (): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'ClipBoard Process',
    targetRpcId: IpcId.ClipBoardProcess,
    defaultPath: ClipBoardProcessPath.clipBoardProcessPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.clipBoardProcessPath',
  })
  return ipc
}
