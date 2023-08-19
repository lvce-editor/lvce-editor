import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const setItems = (items) => {
  return ParentIpc.invoke('ElectronApplicationMenu.setItems', items)
}
