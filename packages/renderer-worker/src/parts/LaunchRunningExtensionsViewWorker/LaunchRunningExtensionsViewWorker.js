import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as RunningExtensionsViewWorkerUrl from '../RunningExtensionsViewWorkerUrl/RunningExtensionsViewWorkerUrl.js'

export const launchRunningExtensionsViewWorker = async () => {
  const name = 'Running Extensions View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.runningExtensionsViewWorkerPath', RunningExtensionsViewWorkerUrl.runningExtensionsViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
