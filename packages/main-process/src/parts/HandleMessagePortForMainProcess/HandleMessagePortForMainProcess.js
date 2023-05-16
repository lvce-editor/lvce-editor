const { BrowserWindow } = require('electron')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const Assert = require('../Assert/Assert.js')
const HandleIpc = require('../HandleIpc/HandleIpc.js')
const IpcChild = require('../IpcChild/IpcChild.js')
const IpcChildType = require('../IpcChildType/IpcChildType.js')

/**
 *
 * @param {import('electron').IpcMainEvent} event
 */
exports.handlePort = async (event, browserWindowPort) => {
  Assert.object(event)
  Assert.object(browserWindowPort)
  const { sender } = event
  const { id } = sender
  const state = AppWindowStates.findById(id)
  if (state) {
    state.port = browserWindowPort
  }
  const browserWindow = BrowserWindow.fromWebContents(sender)
  if (!browserWindow) {
    throw new Error(`no matching browser window found for web contents`)
  }
  const ipc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort: browserWindowPort,
  })
  const handleMinimize = (event) => {
    ipc.send({
      jsonpc: '2.0',
      method: 'NativeHost.handleMinimized',
      params: [],
    })
  }
  const handleMaximize = (event) => {
    ipc.send({
      jsonpc: '2.0',
      method: 'NativeHost.handleMaximized',
      params: [],
    })
  }
  const handleUnmaximize = (event) => {
    ipc.send({
      jsonpc: '2.0',
      method: 'NativeHost.handleUnmaximized',
      params: [],
    })
  }
  const handleClose = () => {
    browserWindow.off('minimize', handleMinimize)
    browserWindow.off('unmaximize', handleUnmaximize)
    browserWindow.off('maximize', handleMaximize)
    browserWindowPort.off('close', handleClose)
    if (state) {
      state.port = undefined
    }
  }
  browserWindow.on('minimize', handleMinimize)
  browserWindow.on('unmaximize', handleUnmaximize)
  browserWindow.on('maximize', handleMaximize)
  browserWindowPort.on('close', handleClose)
  HandleIpc.handleIpc(ipc)
  browserWindowPort.start()
}
