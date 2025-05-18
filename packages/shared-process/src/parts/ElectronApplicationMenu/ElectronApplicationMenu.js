import * as Assert from '../Assert/Assert.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'

export const state = {
  ipcMap: Object.create(null),
}

export const setItems = (ipc, browserWindowId, items) => {
  Assert.object(ipc)
  Assert.number(browserWindowId)
  Assert.array(items)
  state.ipcMap[browserWindowId] = ipc // TODO memory leak
  return ParentIpc.invoke('ElectronApplicationMenu.setItems', items)
}

export const handleClick = (browserWindowId, label) => {
  const ipc = state.ipcMap[browserWindowId]
  if (!ipc) {
    return
  }
  ipc.send({
    jsonrpc: '2.0',
    method: 'ElectronApplicationMenu.handleClick',
    params: [label],
  })
}
