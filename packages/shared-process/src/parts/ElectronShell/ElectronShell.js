import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const beep = () => {
  return ParentIpc.invoke('ElectronShell.beep')
}
