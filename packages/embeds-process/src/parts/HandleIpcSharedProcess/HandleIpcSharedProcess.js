import * as Assert from '../Assert/Assert.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as SharedProcessIpc from '../SharedProcessIpc/SharedProcessIpc.js'

export const targetMessagePort = async (messagePort, message) => {
  Assert.object(messagePort)
  const ipc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
  SharedProcessIpc.state.ipc = ipc
  return ipc
}

export const upgradeMessagePort = () => {
  return {
    type: 'handle',
  }
}
