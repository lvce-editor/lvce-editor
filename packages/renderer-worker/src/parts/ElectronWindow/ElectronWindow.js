import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const forward =
  (key) =>
  async (...args) => {
    const windowId = await GetWindowId.getWindowId()
    return SharedProcess.invoke(key, windowId, ...args)
  }

export const reload = forward('ElectronWindow.reload')

export const minimize = forward('ElectronWindow.minimize')

export const unmaximize = forward('ElectronWindow.unmaximize')

export const maximize = forward('ElectronWindow.maximize')

export const close = forward('ElectronWindow.close')

export const openNew = forward('ElectronWindow.openNew')

export const toggleDevtools = forward('ElectronWindow.toggleDevtools')

export const zoomIn = forward('ElectronWindow.zoomIn')

export const zoomOut = forward('ElectronWindow.zoomOut')

export const zoomReset = forward('ElectronWindow.zoomReset')

export const focus = forward('ElectronWindow.focus')
