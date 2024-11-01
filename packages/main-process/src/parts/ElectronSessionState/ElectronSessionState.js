const state = {
  /**
   * @type {any}
   */
  session: undefined,

  hasWebViewProtocol: false,
}

export const get = () => {
  return state.session
}

export const set = (value) => {
  state.session = value
}

export const hasWebViewProtocol = () => {
  return state.hasWebViewProtocol
}

export const setWebViewProtocol = (value) => {
  state.hasWebViewProtocol = value
}
