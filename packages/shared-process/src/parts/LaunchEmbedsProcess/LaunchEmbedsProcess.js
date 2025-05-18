import * as ConnectIpcToElectron from '../ConnectIpcToElectron/ConnectIpcToElectron.js'
import * as EmbedsProcessPath from '../EmbedsProcessPath/EmbedsProcessPath.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredUrl = async () => {
  if (Platform.isProduction) {
    return EmbedsProcessPath.embedsProcessPath
  }
  const allPreferences = await Preferences.getAll()
  const embedsProcessPath = allPreferences['develop.embedsProcessPath'] || EmbedsProcessPath.embedsProcessPath
  return embedsProcessPath
}

export const launchEmbedsProcess = async () => {
  const path = await getConfiguredUrl()
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path,
    argv: [],
    stdio: 'inherit',
    name: 'Embeds Process',
    ipcId: IpcId.SharedProcess,
    targetRpcId: IpcId.EmbedsProcess,
  })
  HandleIpc.handleIpc(ipc)
  await ConnectIpcToElectron.connectIpcToMainProcess2(ipc, IpcId.EmbedsProcess)
  return ipc
}
