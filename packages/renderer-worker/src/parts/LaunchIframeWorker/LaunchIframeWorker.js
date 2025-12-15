import * as IframeWorkerUrl from '../IframeWorkerUrl/IframeWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchIframeWorker = async () => {
  const name = 'Iframe Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.iframeWorkerPath', IframeWorkerUrl.iframeWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
