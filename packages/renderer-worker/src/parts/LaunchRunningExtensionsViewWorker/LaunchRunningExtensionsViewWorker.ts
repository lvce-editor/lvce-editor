import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import { runningExtensionsViewWorkerUrl } from '../RunningExtensionsViewWorkerUrl/RunningExtensionsViewWorkerUrl.ts'

export const launchRunningExtensionsViewWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Running Extensions View Worker',
    url: getConfiguredWorkerUrl('develop.runningExtensionsViewPath', runningExtensionsViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
