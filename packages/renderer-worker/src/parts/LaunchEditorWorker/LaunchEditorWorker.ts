import * as EditorWorkerUrl from '../EditorWorkerUrl/EditorWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Id from '../Id/Id.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug from '../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'
import * as ShouldUsePreloadedWorker from '../ShouldUsePreloadedWorker/ShouldUsePreloadedWorker.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Transferrable from '../Transferrable/Transferrable.js'

export const launchEditorWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.editorWorkerPath', EditorWorkerUrl.editorWorkerUrl)
  const id = Id.create()
  let ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Editor Worker',
    id,
  })
  if (ShouldUsePreloadedWorker.shouldUsePreloadedWorker('editorWorker')) {
    // TODO should renderer process send port to renderer worker or vice versa?
    const port = Transferrable.acquire(id)
    // TODO wrap port to create ipc
    ipc = IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(port)
  }
  HandleIpc.handleIpc(ipc)
  const range = Id.reserve(1_000_000)
  await JsonRpc.invoke(ipc, 'Id.configure', range.start, range.end)
  const syntaxHighlightingWorker = true
  const syncIncremental = true
  await JsonRpc.invoke(ipc, 'Initialize.initialize', syntaxHighlightingWorker, syncIncremental)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'Editor.handleDirectMessagePort', port1),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', port2, 'Editor'),
  ])
  return ipc
}
