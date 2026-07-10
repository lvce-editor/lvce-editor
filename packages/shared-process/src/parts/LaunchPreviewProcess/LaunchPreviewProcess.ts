import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'
import * as PreviewProcessPath from '../PreviewProcessPath/PreviewProcessPath.ts'

export const launchPreviewProcess = async (): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    defaultPath: PreviewProcessPath.previewProcessPath,
    isElectron: IsElectron.isElectron,
    name: 'Preview Process',
    settingName: 'develop.previewProcessPath',
    targetRpcId: undefined,
  })
  return ipc
}
