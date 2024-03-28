import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import { VError } from '../VError/VError.js'

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
