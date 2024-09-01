import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as PreviewProcessPath from '../PreviewProcessPath/PreviewProcessPath.js'

const getMethod = (isElectron) => {
  if (isElectron) {
    return IpcParentType.ElectronUtilityProcess
  }
  return IpcParentType.NodeForkedProcess
}

export const launchPreviewProcess = async () => {
  const preferences = await Preferences.getUserPreferences()
  const customPreviewProcessPath = preferences['develop.previewProcessPath']
  const previewProcessPath = customPreviewProcessPath || PreviewProcessPath.previewProcessPath
  const method = getMethod(IsElectron.isElectron)
  const previewProcess = await IpcParent.create({
    method,
    path: previewProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'Preview Process',
  })
  HandleIpc.handleIpc(previewProcess)
  return previewProcess
}
