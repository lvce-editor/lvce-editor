import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import { quickPickWorkerUrl } from '../QuickPickWorkerUrl/QuickPickWorkerUrl.js'

export const launchQuickPickWorker = async () => {
  const name = 'QuickPick Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.quickPickWorkerPath', quickPickWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
