import * as ParentIpc from '../MainProcess/MainProcess.js'

export const beep = () => {
  return ParentIpc.invoke('ElectronShell.beep')
}
