import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IconThemeWorkerUrl from '../IconThemeWorkerUrl/IconThemeWorkerUrl.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as Id from '../Id/Id.js'
import * as IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug from '../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'
import * as ShouldUsePreloadedWorker from '../ShouldUsePreloadedWorker/ShouldUsePreloadedWorker.ts'
import * as Transferrable from '../Transferrable/Transferrable.js'

export const launchIconThemeWorker = async () => {
  const name = 'Icon Theme Worker'
  const id = Id.create()
  let ipc = await IpcParent.create({
    id,
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.iconThemeWorkerPath', IconThemeWorkerUrl.iconThemeWorkerUrl),
  })
  if (ShouldUsePreloadedWorker.shouldUsePreloadedWorker('iconThemeWorker')) {
    ipc = IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(Transferrable.acquire(id))
  }
  HandleIpc.handleIpc(ipc)
  return ipc
}
