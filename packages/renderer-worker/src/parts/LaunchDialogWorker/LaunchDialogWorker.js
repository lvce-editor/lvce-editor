import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as DialogWorkerUrl from '../DialogWorkerUrl/DialogWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getWorkerName = () => {
  if (Platform.getPlatform() === PlatformType.Electron) {
    return 'Dialog Worker (Electron)'
  }
  return 'Dialog Worker (Web)'
}

export const launchDialogWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: getWorkerName(),
    url: getConfiguredWorkerUrl('develop.dialogWorkerPath', DialogWorkerUrl.dialogWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
