import * as BlobWorkerUrl from '../BlobWorkerUrl/BlobWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchBlobWorker = async () => {
  const name = 'Blob Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.blobWorkerPath', BlobWorkerUrl.blobWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
