import { existsSync } from 'node:fs'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Preferences from '../Preferences/Preferences.ts'

const getConfiguredUrl = async (settingName, defaultPath) => {
  if (Platform.isProduction) {
    return defaultPath
  }
  const allPreferences = await Preferences.getAll()
  const processPath = allPreferences[settingName] || defaultPath
  if (existsSync(processPath)) {
    return processPath
  }
  return defaultPath
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
