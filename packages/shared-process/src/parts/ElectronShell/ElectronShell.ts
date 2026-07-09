import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const beep = () => {
  return ParentIpc.invoke('ElectronShell.beep')
}
