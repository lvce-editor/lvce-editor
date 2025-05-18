import * as ParentIpc from '../MainProcess/MainProcess.js'

export const open = () => {
  return ParentIpc.invoke('ElectronWindowAbout.open')
}
