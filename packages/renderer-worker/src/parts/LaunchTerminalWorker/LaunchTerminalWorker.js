import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as TerminalWorkerUrl from '../TerminalWorkerUrl/TerminalWorkerUrl.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'

export const launchTerminalWorker = async () => {
  const name = Platform.getPlatform() === PlatformType.Electron ? 'Terminal Worker (Electron)' : 'Terminal Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: TerminalWorkerUrl.terminalWorkerUrl,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
