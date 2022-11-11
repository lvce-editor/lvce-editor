import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const writeText = (text) => {
  return ElectronProcess.invoke('ElectronClipBoard.writeText', text)
}
