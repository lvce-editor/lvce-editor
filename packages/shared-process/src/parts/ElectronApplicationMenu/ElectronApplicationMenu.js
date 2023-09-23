import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const state = {
  ipcMap: Object.create(null),
}

export const setItems = (ipc, browserWindowId, items) => {
  console.log({ ipc })
  state.ipcMap[browserWindowId] = ipc
  return ParentIpc.invoke('ElectronApplicationMenu.setItems', items)
}

export const handleClick = (browserWindowId, label) => {
  const ipc = state.ipcMap[browserWindowId]
  if (!ipc) {
    return
  }
  console.log({ browserWindowId, label })
}
