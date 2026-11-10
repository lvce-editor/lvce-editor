import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as PreviewWorkerUrl from '../PreviewWorkerUrl/PreviewWorkerUrl.js'

export const launchPreviewWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.previewWorkerPath', PreviewWorkerUrl.previewWorkerUrl)
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Preview Worker',
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'Preview.handleMessagePort', port1),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', port2, 'Preview'),
  ])
  return ipc
}
