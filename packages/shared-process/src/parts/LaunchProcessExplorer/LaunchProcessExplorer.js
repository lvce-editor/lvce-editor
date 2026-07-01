import * as ConnectIpcToElectron from '../ConnectIpcToElectron/ConnectIpcToElectron.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'
import * as ProcessExplorerPath from '../ProcessExplorerPath/ProcessExplorerPath.js'

export const launchProcessExplorer = async () => {
  console.log('will start process explorer')
  const ipc = await LaunchProcess.launchProcess({
    name: 'Process Explorer',
    defaultPath: ProcessExplorerPath.processExplorerPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.processExplorerPath',
    targetRpcId: IpcId.ProcessExplorer,
  })
  if (IsElectron.isElectron) {
    await ConnectIpcToElectron.connectIpcToElectron(ipc, IpcId.ProcessExplorerRenderer)
  }
  HandleIpc.unhandleIpc(ipc)
  console.log('did start process explorer')
  return ipc
}
