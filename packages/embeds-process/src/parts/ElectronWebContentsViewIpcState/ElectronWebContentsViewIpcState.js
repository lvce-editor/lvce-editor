const state = {
  ipcMap: Object.create(null),
}

export const add = (id, ipc) => {
  state.ipcMap[id] = ipc
}

export const get = (id) => {
  return state.ipcMap[id]
}

export const remove = (id) => {
  delete state.ipcMap[id]
}

export const getAll = () => {
  return Object.entries(state.ipcMap)
}
