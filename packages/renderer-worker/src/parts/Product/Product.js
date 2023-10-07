import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getProductNameLong = () => {
  return SharedProcess.invoke('Platform.getProductNameLong')
}
