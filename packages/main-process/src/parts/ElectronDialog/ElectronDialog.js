import * as Electron from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Logger from '../Logger/Logger.js'

export const showOpenDialog = async (title, properties) => {
  Assert.string(title)
  Assert.array(properties)
  const focusedWindow = ElectronWindow.getFocusedWindow()
  if (!focusedWindow) {
    return
  }
  const result = await Electron.dialog.showOpenDialog(focusedWindow, {
    properties,
    title,
  })
  if (result.canceled || result.filePaths.length !== 1) {
    return
  }
  // TODO maybe return whole result (including canceled or not)
  return result.filePaths
}

const getWindow = (windowId) => {
  if (windowId === -1) {
    return ElectronWindow.getFocusedWindow()
  }
  return ElectronWindow.findById(windowId)
}

/**
 *
 * @param {{message:string, buttons:string[], type:'error'|'info'|'question'|'none'|'warning', detail?:string, title?:string, windowId?:number, productName?:string, defaultId?:number  }} options
 * @returns
 */
export const showMessageBox = async ({
  message,
  buttons,
  type = ElectronMessageBoxType.Error,
  detail,
  title,
  windowId = -1,
  productName,
  defaultId,
}) => {
  Assert.string(message)
  Assert.array(buttons)
  const window = getWindow(windowId)
  if (!window) {
    Logger.info(`[main-process] cannot show dialog message because there is no window with id ${windowId}`)
    return
  }
  if (message.message) {
    message = message.message
  }
  const result = await Electron.dialog.showMessageBox(window, {
    type,
    message,
    title: title || productName,
    buttons,
    cancelId: 1,
    detail,
    noLink: true,
    defaultId,
  })
  const selectedButtonIndex = result.response
  return selectedButtonIndex
}
