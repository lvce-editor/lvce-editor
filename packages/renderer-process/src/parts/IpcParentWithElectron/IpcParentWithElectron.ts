import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
// @ts-ignore
import { IpcChildWithWindow } from '/static/js/lvce-editor-ipc.js'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

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
