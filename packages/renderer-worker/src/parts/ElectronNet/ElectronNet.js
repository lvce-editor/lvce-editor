import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const getJson = (url) => {
  return ElectronProcess.invoke('ElectronNet.getJson', url)
}
