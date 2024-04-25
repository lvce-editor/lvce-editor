import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
// @ts-ignore
import { IpcChildWithWindow } from '../../../../../static/js/lvce-editor-ipc.js'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as Assert from '../Assert/Assert.ts'

export const create = async ({ port, ipcId }) => {
  Assert.number(ipcId)
  if (!IsElectron.isElectron) {
    throw new Error('Electron api was requested but is not available')
  }
  const windowIpc = IpcChildWithWindow.wrap(window)
  HandleIpc.handleIpc(windowIpc)
  const webContentsIds = await JsonRpc.invokeAndTransfer(windowIpc, [port], 'CreateMessagePort.createMessagePort', ipcId)
  windowIpc.dispose()
  return webContentsIds
}
