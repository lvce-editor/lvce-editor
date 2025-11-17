import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as SimpleBrowserWorkerUrl from '../SimpleBrowserWorkerUrl/SimpleBrowserWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchSimpleBrowserWorker = async () => {
  const name = 'Simple Browser Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.simpleBrowserWorkerPath', SimpleBrowserWorkerUrl.simpleBrowserWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
