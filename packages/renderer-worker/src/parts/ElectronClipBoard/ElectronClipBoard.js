import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const writeText = (text) => {
  return SharedProcess.invoke('ElectronClipBoard.writeText', text)
}
