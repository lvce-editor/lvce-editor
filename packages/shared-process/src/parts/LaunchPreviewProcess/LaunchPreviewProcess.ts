import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'
import * as PreviewProcessPath from '../PreviewProcessPath/PreviewProcessPath.ts'

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
