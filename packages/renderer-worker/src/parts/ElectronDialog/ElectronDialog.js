import * as Assert from '../Assert/Assert.ts'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as Product from '../Product/Product.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

let mockOpenDialogUri = undefined

export const mockOpenDialog = (uri) => {
  if (typeof uri !== 'string') {
    throw new TypeError('expected uri to be a string')
  }
  mockOpenDialogUri = uri
}

export const resetMockOpenDialog = () => {
  mockOpenDialogUri = undefined
}

export const showOpenDialog = (title, properties) => {
  if (mockOpenDialogUri) {
    return mockOpenDialogUri
  }
  return SharedProcess.invoke('ElectronDialog.showOpenDialog', title, properties)
}

export const showMessageBox = async (options) => {
  // TODO maybe request window id here instead of at caller
  Assert.object(options)
  const productName = options.productName ?? (await Product.getProductNameLong())
  const windowId = await GetWindowId.getWindowId()
  const finalOptions = {
    ...options,
    productName,
    windowId,
  }
  return SharedProcess.invoke('ElectronDialog.showMessageBox', finalOptions)
}
