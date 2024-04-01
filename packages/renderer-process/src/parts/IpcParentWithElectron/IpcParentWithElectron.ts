import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChildWithWindow from '../IpcChildWithWindow/IpcChildWithWindow.ts'
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
