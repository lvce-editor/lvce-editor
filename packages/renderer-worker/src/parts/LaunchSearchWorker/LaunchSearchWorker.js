import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as SearchWorkerUrl from '../SearchWorkerUrl/SearchWorkerUrl.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'

export const launchSearchWorker = async () => {
  const name = Platform.getPlatform() === PlatformType.Electron ? 'Search Worker (Electron)' : 'Search Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: SearchWorkerUrl.searchWorkerUrl,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
