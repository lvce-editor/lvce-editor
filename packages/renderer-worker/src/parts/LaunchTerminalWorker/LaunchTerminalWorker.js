import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as TerminalWorkerUrl from '../TerminalWorkerUrl/TerminalWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'

export const launchTerminalWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Terminal Worker',
    url: TerminalWorkerUrl.terminalWorkerUrl,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
