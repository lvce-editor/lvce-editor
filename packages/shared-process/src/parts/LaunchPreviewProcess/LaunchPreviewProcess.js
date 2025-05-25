import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'
import * as PreviewProcessPath from '../PreviewProcessPath/PreviewProcessPath.js'

export const launchPreviewProcess = async () => {
  const ipc = await LaunchProcess.launchProcess({
    settingName: 'develop.previewProcessPath',
    name: 'Preview Process',
    defaultPath: PreviewProcessPath.previewProcessPath,
    isElectron: IsElectron.isElectron,
    targetRpcId: undefined,
  })
  return ipc
}
