import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as CacheWorkerUrl from '../CacheWorkerUrl/CacheWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchCacheWorker = async () => {
  const name = 'Cache Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.cacheWorkerPath', CacheWorkerUrl.cacheWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
