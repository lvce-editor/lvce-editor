import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as TerminalWorkerUrl from '../TerminalWorkerUrl/TerminalWorkerUrl.js'

export const launchTerminalWorker = () => {
  return IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Terminal Worker',
    url: TerminalWorkerUrl.terminalWorkerUrl,
  })
}
