import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as PreviewWorkerUrl from '../PreviewWorkerUrl/PreviewWorkerUrl.js'

export const launchPreviewWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
    'develop.previewWorkerPath',
    PreviewWorkerUrl.previewWorkerUrl,
  )
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Preview Worker',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
