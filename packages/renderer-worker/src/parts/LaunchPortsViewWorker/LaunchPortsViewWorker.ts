import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as PortsViewWorkerUrl from '../PortsViewWorkerUrl/PortsViewWorkerUrl.ts'

export const launchPortsViewWorker = async (): Promise<any> => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Ports View Worker',
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.portsViewPath', PortsViewWorkerUrl.portsViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
