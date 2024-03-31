export const state = {
  /**
   * @type {any[]}
   */
  errors: [],
}

export const addError = (error) => {
  state.errors.push(error)
}

export const hasRecentErrors = () => {
  return state.errors.length > 0
}

export const getRecentError = () => {
  return state.errors.at(-1)
}
