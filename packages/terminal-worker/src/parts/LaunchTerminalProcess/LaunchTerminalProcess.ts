import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as TerminalProcessState from '../TerminalProcessState/TerminalProcessState.ts'
import { VError } from '../VError/VError.ts'

export const launchTerminalProcess = async () => {
  try {
    const ipc = await IpcParent.create({
      method: IpcParentType.NodeAlternate,
      type: 'terminal-process',
      name: 'Terminal Process',
    })
    TerminalProcessState.state.ipc = ipc
    HandleIpc.handleIpc(ipc, 'terminal process')
  } catch (error) {
    throw new VError(error, 'Failed to create terminal connection')
  }
}
