import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import { VError } from '../VError/VError.ts'

export const launchTerminalProcess = async () => {
  try {
    const ipc = await IpcParent.create({
      method: IpcParentType.NodeAlternate,
      type: 'terminal-process',
      name: 'Terminal Process',
    })
    HandleIpc.handleIpc(ipc, 'terminal process')
  } catch (error) {
    throw new VError(error, 'Failed to create terminal connection')
  }
}
