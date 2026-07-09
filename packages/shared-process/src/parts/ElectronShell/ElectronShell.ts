import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const beep = (): any => {
  return ParentIpc.invoke('ElectronShell.beep')
}
