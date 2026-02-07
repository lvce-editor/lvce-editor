import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as PreviewSandBoxWorkerUrl from '../PreviewSandBoxWorkerUrl/PreviewSandBoxWorkerUrl.js'

export const launchPreviewSandBoxWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
    'develop.previewSandboxWorkerPath',
    PreviewSandBoxWorkerUrl.previewSandBoxWorkerUrl,
  )
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Preview Sandbox Worker',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
