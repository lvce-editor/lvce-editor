import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Id from '../Id/Id.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug from '../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as MainAreaWorkerUrl from '../MainAreaWorkerUrl/MainAreaWorkerUrl.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ShouldUsePreloadedWorker from '../ShouldUsePreloadedWorker/ShouldUsePreloadedWorker.ts'
import * as Transferrable from '../Transferrable/Transferrable.js'

export const launchMainAreaWorker = async () => {
  const id = Id.create()
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.mainAreaWorkerPath', MainAreaWorkerUrl.mainAreaWorkerUrl)
  let ipc = await IpcParent.create({
    id,
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Main Area Worker',
  })
  if (ShouldUsePreloadedWorker.shouldUsePreloadedWorker('mainAreaWorker')) {
    ipc = IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(Transferrable.acquire(id))
  }
  HandleIpc.handleIpc(ipc)
  const range = Id.reserve(1_000_000)
  await JsonRpc.invoke(ipc, 'Id.configure', range.start, range.end)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'MainArea.handleMessagePort', port1),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', port2, 'MainArea'),
  ])
  return ipc
}
