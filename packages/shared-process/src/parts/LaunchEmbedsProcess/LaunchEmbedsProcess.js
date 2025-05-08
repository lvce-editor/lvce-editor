import * as ConnectIpcToElectron from '../ConnectIpcToElectron/ConnectIpcToElectron.js'
import * as EmbedsProcessPath from '../EmbedsProcessPath/EmbedsProcessPath.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IpcId from '../IpcId/IpcId.js'

export const launchEmbedsProcess = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: EmbedsProcessPath.embedsProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'Embeds Process',
    ipcId: IpcId.EmbedsProcess,
  })
  HandleIpc.handleIpc(ipc)
  await ConnectIpcToElectron.connectIpcToElectron(ipc, IpcId.EmbedsProcess)
  return ipc
}
