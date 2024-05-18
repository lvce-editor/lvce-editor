export const state = {
  /**
   * @type {any}
   */
  currentEditor: undefined,
  hasListener: false,
  position: {
    rowIndex: 0,
    columnIndex: 0,
  },
}

export const setEditor = (editor) => {
  state.currentEditor = editor
  state.hasListener = true
}

export const clearEditor = () => {
  state.currentEditor = undefined
  state.hasListener = false
}

export const setPosition = (position) => {
  state.position = position
}

export const getEditor = () => {
  return state.currentEditor
}

export const getPosition = () => {
  return state.position
}

export const hasListener = () => {
  return state.hasListener
}
