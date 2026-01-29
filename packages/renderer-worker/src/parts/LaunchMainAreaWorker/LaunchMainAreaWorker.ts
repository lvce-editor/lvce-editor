import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as MainAreaWorkerUrl from '../MainAreaWorkerUrl/MainAreaWorkerUrl.js'

export const launchMainAreaWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.mainAreaWorkerPath', MainAreaWorkerUrl.mainAreaWorkerUrl)
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Main Area Worker',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
