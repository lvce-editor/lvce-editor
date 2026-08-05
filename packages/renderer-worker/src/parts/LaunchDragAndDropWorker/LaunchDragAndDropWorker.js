import * as DragAndDropWorkerUrl from '../DragAndDropWorkerUrl/DragAndDropWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchDragAndDropWorker = async () => {
  const name = 'Drag And Drop Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.dragAndDropWorkerPath', DragAndDropWorkerUrl.dragAndDropWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
