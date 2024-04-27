import * as HandleIpcOnce from '../HandleIpcOnce/HandleIpcOnce.ts'
// @ts-ignore
import { IpcChildWithWindow } from '../../../../../static/js/lvce-editor-ipc-7.js'
import * as Assert from '../Assert/Assert.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

// TODO use handleIncomingIpc function
export const create = async ({ port, ipcId }) => {
  Assert.number(ipcId)
  if (!IsElectron.isElectron) {
    throw new Error('Electron api was requested but is not available')
  }
  const windowIpc = IpcChildWithWindow.wrap(window)

  const promise = JsonRpc.invokeAndTransfer(windowIpc, [port], 'CreateMessagePort.createMessagePort', ipcId)
  windowIpc.addEventListener('message', (x) => {
    // if (x.target === windowIpc) {
    //   return
    // }
    console.trace({ x })
  })
  // HandleIpcOnce.handleIpcOnce(windowIpc)
  console.log('before wait')
  const webContentsIds = await promise
  console.log('after wait')
  return webContentsIds
}
