import { existsSync } from 'node:fs'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Preferences from '../Preferences/Preferences.ts'

const getConfiguredUrl = async (settingName: any, defaultPath: any): Promise<any> => {
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

export const launchProcess = async ({ defaultPath, isElectron, name, settingName, targetRpcId }: any): Promise<any> => {
  const path = await getConfiguredUrl(settingName, defaultPath)
  const method = isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const ipc = await IpcParent.create({
    argv: [],
    ipcId: IpcId.SharedProcess,
    method,
    name,
    path,
    stdio: 'inherit',
    targetRpcId,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
