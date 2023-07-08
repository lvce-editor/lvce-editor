import * as CommandState from '../CommandState/CommandState.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as Module from '../Module/Module.js'

export const main = async () => {
  CommandState.setLoad(Module.load)
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  HandleIpc.handleIpc(ipc)
}
