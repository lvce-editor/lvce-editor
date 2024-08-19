import * as EditorWorkerUrl from '../EditorWorkerUrl/EditorWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const launchEditorWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('developer.editorWorkerPath', EditorWorkerUrl.editorWorkerUrl)
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Editor Worker',
  })
  HandleIpc.handleIpc(ipc)
  const syntaxHighlightingWorker = true
  const syncIncremental = true
  await JsonRpc.invoke(ipc, 'Initialize.initialize', syntaxHighlightingWorker, syncIncremental)
  return ipc
}
