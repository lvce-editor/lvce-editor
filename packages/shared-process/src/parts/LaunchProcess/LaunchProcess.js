import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredUrl = async (settingName, defaultPath) => {
  if (Platform.isProduction) {
    return defaultPath
  }
  const allPreferences = await Preferences.getAll()
  const processPath = allPreferences[settingName] || defaultPath
  return processPath
}

export const launchProcess = async ({ settingName, defaultPath, targetRpcId, name, isElectron }) => {
  const path = await getConfiguredUrl(settingName, defaultPath)
  const method = isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const ipc = await IpcParent.create({
    method,
    path,
    argv: [],
    stdio: 'inherit',
    name,
    ipcId: IpcId.SharedProcess,
    targetRpcId,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
