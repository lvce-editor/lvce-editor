import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as KeyBindingsViewWorkerUrl from '../KeyBindingsViewWorkerUrl/KeyBindingsViewWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const launchKeyBindingsViewWorker = async () => {
  const name = 'KeyBindings View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.keyBindingsViewWorkerPath', KeyBindingsViewWorkerUrl.keyBindingsViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'KeyBindings.handleMessagePort', port1),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', port2),
  ])
  return ipc
}
