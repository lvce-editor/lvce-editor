import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const writeText = (text) => {
  return ParentIpc.invoke('ElectronClipBoard.writeText', text)
}
