import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import { quickPickWorkerUrl } from '../QuickPickWorkerUrl/QuickPickWorkerUrl.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const launchQuickPickWorker = async () => {
  const name = 'QuickPick Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.quickPickWorkerPath', quickPickWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  const { port1: extensionHostPort1, port2: extensionHostPort2 } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'QuickPick.handleRendererProcessMessagePort', port1),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', port2, 'QuickPick'),
    JsonRpc.invokeAndTransfer(ipc, 'QuickPick.handleMessagePort', extensionHostPort1),
    RendererProcess.handleQuickPickExtensionHostMessagePort(extensionHostPort2),
  ])
  return ipc
}
