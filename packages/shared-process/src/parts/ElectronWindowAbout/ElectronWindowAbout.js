import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const open = () => {
  return ParentIpc.invoke('ElectronWindowAbout.open')
}
