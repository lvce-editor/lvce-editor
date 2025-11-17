import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as TitleBarWorkerUrl from '../TitleBarWorkerUrl/TitleBarWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchTitleBarWorker = async () => {
  const name = 'Title Bar Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.titleBarWorkerPath', TitleBarWorkerUrl.titleBarWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
