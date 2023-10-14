import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const beep = () => {
  return SharedProcess.invoke('ElectronShell.beep')
}
