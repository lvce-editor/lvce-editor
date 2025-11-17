import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IconThemeWorkerUrl from '../IconThemeWorkerUrl/IconThemeWorkerUrl.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchIconThemeWorker = async () => {
  const name = 'Icon Theme Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.iconThemeWorkerPath', IconThemeWorkerUrl.iconThemeWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
