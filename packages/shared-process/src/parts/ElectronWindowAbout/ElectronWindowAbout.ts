import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const open = (): any => {
  return ParentIpc.invoke('ElectronWindowAbout.open')
}
