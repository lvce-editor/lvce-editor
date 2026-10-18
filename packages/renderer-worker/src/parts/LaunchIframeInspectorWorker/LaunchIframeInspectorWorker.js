import * as IframeInspectorWorkerUrl from '../IframeInspectorWorkerUrl/IframeInspectorWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchIframeInspectorWorker = async () => {
  const name = 'Iframe Inspector Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.iframeInspectorWorkerPath', IframeInspectorWorkerUrl.iframeInspectorWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
