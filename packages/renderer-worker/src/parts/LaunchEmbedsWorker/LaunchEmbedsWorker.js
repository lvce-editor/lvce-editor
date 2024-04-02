import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as EmbedsWorkerUrl from '../EmbedsWorkerUrl/EmbedsWorkerUrl.js'

export const launchEmbedsWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: EmbedsWorkerUrl.embedsWorkerUrl,
    name: 'Embeds Worker',
  })
  HandleIpc.handleIpc(ipc, 'embeds-worker')
  return ipc
}
