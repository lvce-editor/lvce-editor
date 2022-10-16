export const state = {
  /**
   * @type {any[]}
   */
  keyBindings: [],
}

export const setKeyBindings = (keyBindings) => {
  state.keyBindings = keyBindings
}
export const getKeyBindings = () => {
  return state.keyBindings
}
