const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const get = () => {
  return state.ipc
}

export const set = (ipc: any) => {
  state.ipc = ipc
}
