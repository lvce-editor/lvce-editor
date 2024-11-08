const state = {
  /**
   * @type {any}
   */
  session: undefined,
}

export const get = () => {
  return state.session
}

export const set = (value) => {
  state.session = value
}
