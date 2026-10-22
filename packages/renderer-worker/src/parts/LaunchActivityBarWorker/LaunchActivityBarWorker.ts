import * as ActivityBarWorkerUrl from '../ActivityBarWorkerUrl/ActivityBarWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Id from '../Id/Id.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug from '../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ShouldUsePreloadedWorker from '../ShouldUsePreloadedWorker/ShouldUsePreloadedWorker.ts'
import * as Transferrable from '../Transferrable/Transferrable.js'

export const launchActivityBarWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
    'develop.activityBarWorkerPath',
    ActivityBarWorkerUrl.activityBarWorkerUrl,
  )
  const id = Id.create()
  let ipc = await IpcParent.create({
    id,
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Activity Bar Worker',
  })
  if (ShouldUsePreloadedWorker.shouldUsePreloadedWorker('activityBarWorker')) {
    ipc = IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(Transferrable.acquire(id))
  }
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'ActivityBar.handleMessagePort', port1),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', port2, 'ActivityBar'),
  ])
  return ipc
}
