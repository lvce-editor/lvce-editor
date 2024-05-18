import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as EditorWorkerUrl from '../EditorWorkerUrl/EditorWorkerUrl.js'

export const launchEditorWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: EditorWorkerUrl.editorWorkerUrl,
    name: 'Editor Worker',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
