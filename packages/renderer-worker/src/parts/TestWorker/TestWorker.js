const state = {
  ipc: undefined,
}

/**
 *
 * @returns {any}
 */
export const get = () => {
  return state.ipc
}

export const set = (ipc) => {
  state.ipc = ipc
}
