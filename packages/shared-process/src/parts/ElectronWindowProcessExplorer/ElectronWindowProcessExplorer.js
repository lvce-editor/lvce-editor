import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const open = () => {
  return ParentIpc.invoke('ElectronWindowProcessExplorer.open')
}
