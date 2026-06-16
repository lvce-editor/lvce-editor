import * as Assert from '../Assert/Assert.ts'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as Product from '../Product/Product.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

let mockOpenDialogPaths = undefined

export const mockOpenDialog = (paths) => {
  if (!Array.isArray(paths)) {
    throw new TypeError('expected paths to be an array')
  }
  mockOpenDialogPaths = paths
}

export const resetMockOpenDialog = () => {
  mockOpenDialogPaths = undefined
}

export const showOpenDialog = (title, properties) => {
  if (mockOpenDialogPaths) {
    return mockOpenDialogPaths
  }
  return SharedProcess.invoke('ElectronDialog.showOpenDialog', title, properties)
}

export const showMessageBox = async (options) => {
  // TODO maybe request window id here instead of at caller
  Assert.object(options)
  const productName = await Product.getProductNameLong()
  const windowId = await GetWindowId.getWindowId()
  const finalOptions = {
    ...options,
    productName,
    windowId,
  }
  return SharedProcess.invoke('ElectronDialog.showMessageBox', finalOptions)
}
