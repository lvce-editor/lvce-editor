import * as EditorWorkerUrl from '../EditorWorkerUrl/EditorWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Id from '../Id/Id.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IpcState from '../IpcState/IpcState.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug from '../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'

export const launchEditorWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('developer.editorWorkerPath', EditorWorkerUrl.editorWorkerUrl)
  const id = Id.create()
  let ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Editor Worker',
    id,
  })
  if (IpcState.getConfig()) {
    // TODO should renderer process send port to renderer worker or vice versa?
    const port = Transferrable.acquire(id)
    // TODO wrap port to create ipc
    ipc = IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(port)
  }
  HandleIpc.handleIpc(ipc)
  const syntaxHighlightingWorker = true
  const syncIncremental = true
  await JsonRpc.invoke(ipc, 'Initialize.initialize', syntaxHighlightingWorker, syncIncremental)
  return ipc
}
