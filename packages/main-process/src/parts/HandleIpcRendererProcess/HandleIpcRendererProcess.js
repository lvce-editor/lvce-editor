import * as Assert from '../Assert/Assert.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const targetMessagePort = async (messagePort, message) => {
  Assert.object(messagePort)
  const ipc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
  return ipc
}

export const upgradeMessagePort = () => {
  return {
    type: 'handle',
  }
}
