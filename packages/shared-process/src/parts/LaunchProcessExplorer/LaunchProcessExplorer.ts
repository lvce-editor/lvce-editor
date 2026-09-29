import * as ConnectIpcToElectron from '../ConnectIpcToElectron/ConnectIpcToElectron.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'
import * as ProcessExplorerPath from '../ProcessExplorerPath/ProcessExplorerPath.ts'

export const launchProcessExplorer = async (): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    defaultPath: ProcessExplorerPath.processExplorerPath,
    isElectron: IsElectron.isElectron,
    name: 'Process Explorer',
    settingName: 'develop.processExplorerPath',
    targetRpcId: IpcId.ProcessExplorer,
  })
  if (IsElectron.isElectron) {
    await ConnectIpcToElectron.connectIpcToElectron(ipc, IpcId.ProcessExplorerRenderer)
  }
  HandleIpc.unhandleIpc(ipc)
  return ipc
}
