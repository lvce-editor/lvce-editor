import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as TerminalWorkerUrl from '../TerminalWorkerUrl/TerminalWorkerUrl.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchTerminalWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.terminalWorkerPath', TerminalWorkerUrl.terminalWorkerUrl)
  const name = Platform.getPlatform() === PlatformType.Electron ? 'Terminal Worker (Electron)' : 'Terminal Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: configuredWorkerUrl,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
