const state = {
  /**
   * @type {HTMLElement|undefined}
   */
  $PreviousFocusElement: undefined,
  currentFocus: '',
}



export const setElement = ($Element) => {
  state.$PreviousFocusElement = $Element
}

export const getElement = () => {
  return state.$PreviousFocusElement
}
