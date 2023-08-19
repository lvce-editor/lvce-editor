import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Assert from '../Assert/Assert.js'
import * as Product from '../Product/Product.js'

export const showOpenDialog = (title, properties) => {
  return SharedProcess.invoke('ElectronDialog.showOpenDialog', title, properties)
}

export const showMessageBox = async (options) => {
  // TODO maybe request window id here instead of at caller
  Assert.object(options)
  const productName = await Product.getProductNameLong()
  const finalOptions = {
    ...options,
    productName,
  }
  return SharedProcess.invoke('ElectronDialog.showMessageBox', finalOptions)
}
