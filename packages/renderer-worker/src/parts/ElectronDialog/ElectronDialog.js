import * as Assert from '../Assert/Assert.js'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as Product from '../Product/Product.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const showOpenDialog = (title, properties) => {
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
