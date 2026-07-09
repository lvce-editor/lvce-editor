import * as Assert from '../Assert/Assert.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'

const state = {
  ipcMap: Object.create(null),
}

export const setItems = (ipc, browserWindowId, items) => {
  Assert.object(ipc)
  Assert.number(browserWindowId)
  Assert.array(items)
  state.ipcMap[browserWindowId] = ipc // TODO memory leak
  return ParentIpc.invoke('ElectronApplicationMenu.setItems', items)
}

export const handleClick = async (browserWindowId, label) => {
  const ipc = state.ipcMap[browserWindowId]
  if (!ipc) {
    return
  }
  // TODO this might fail, e.g. when window closes before
  // a response can be returned, creating a possible promise memory leak
  await JsonRpc.invoke(ipc, 'TitleBar.handleElectronMenuClick', label)
}
