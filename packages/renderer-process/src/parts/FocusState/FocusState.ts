export const state = {
  /**
   * @type {HTMLElement|undefined}
   */
  $PreviousFocusElement: undefined,
  currentFocus: '',
}

export const get = () => {
  return state.currentFocus
}

export const set = (value) => {
  state.currentFocus = value
}

export const setElement = ($Element) => {
  state.$PreviousFocusElement = $Element
}

export const getElement = () => {
  return state.$PreviousFocusElement
}
