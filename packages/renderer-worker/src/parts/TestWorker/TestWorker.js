const state = {
  ipc: undefined,
}

export const get = () => {
  return state.ipc
}

export const set = (ipc) => {
  state.ipc = ipc
}
