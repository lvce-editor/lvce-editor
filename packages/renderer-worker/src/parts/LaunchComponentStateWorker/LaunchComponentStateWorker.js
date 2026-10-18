import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ComponentStateWorkerUrl from '../ComponentStateWorkerUrl/ComponentStateWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchComponentStateWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Component State Worker',
    url: getConfiguredWorkerUrl('develop.componentStateWorkerPath', ComponentStateWorkerUrl.componentStateWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'ComponentState.handleMessagePort', port1),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', port2, 'ComponentState'),
  ])
  return ipc
}
