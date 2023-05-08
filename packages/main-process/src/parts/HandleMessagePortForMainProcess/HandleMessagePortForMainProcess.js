const { BrowserWindow } = require('electron')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const Assert = require('../Assert/Assert.js')
const Command = require('../Command/Command.js')
const GetResponse = require('../GetResponse/GetResponse.js')

/**
 *
 * @param {import('electron').IpcMainEvent} event
 */
exports.handlePort = (event, browserWindowPort) => {
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
  const handleMinimize = (event) => {
    browserWindowPort.postMessage({
      jsonpc: '2.0',
      method: 'NativeHost.handleMinimized',
      params: [],
    })
  }
  const handleMaximize = (event) => {
    browserWindowPort.postMessage({
      jsonpc: '2.0',
      method: 'NativeHost.handleMaximized',
      params: [],
    })
  }
  const handleUnmaximize = (event) => {
    browserWindowPort.postMessage({
      jsonpc: '2.0',
      method: 'NativeHost.handleUnmaximized',
      params: [],
    })
  }
  const handleMessage = async (event) => {
    const message = event.data
    const response = await GetResponse.getResponse(message, Command.execute)
    browserWindowPort.postMessage(response)
  }
  const handleClose = () => {
    browserWindow.off('minimize', handleMinimize)
    browserWindow.off('unmaximize', handleUnmaximize)
    browserWindow.off('maximize', handleMaximize)
    browserWindowPort.off('message', handleMessage)
    browserWindowPort.off('close', handleClose)
    if (state) {
      state.port = undefined
    }
  }
  browserWindow.on('minimize', handleMinimize)
  browserWindow.on('unmaximize', handleUnmaximize)
  browserWindow.on('maximize', handleMaximize)
  browserWindowPort.on('message', handleMessage)
  browserWindowPort.on('close', handleClose)
  browserWindowPort.start()
}
