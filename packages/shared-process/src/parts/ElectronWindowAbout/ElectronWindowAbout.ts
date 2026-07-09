import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const open = () => {
  return ParentIpc.invoke('ElectronWindowAbout.open')
}
