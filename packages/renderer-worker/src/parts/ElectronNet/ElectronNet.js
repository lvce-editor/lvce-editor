import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getJson = (url) => {
  return SharedProcess.invoke('ElectronNet.getJson', url)
}
