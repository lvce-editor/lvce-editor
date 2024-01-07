import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChildWithWindow from '../IpcChildWithWindow/IpcChildWithWindow.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const create = async ({ type, name, port }) => {
  if (!IsElectron.isElectron) {
    throw new Error('Electron api was requested but is not available')
  }
  const windowIpc = IpcChildWithWindow.wrap(window)
  HandleIpc.handleIpc(windowIpc)
  await JsonRpc.invokeAndTransfer(windowIpc, [port], 'CreateMessagePort.createMessagePort', type, name)
  windowIpc.dispose()
  return undefined
}
