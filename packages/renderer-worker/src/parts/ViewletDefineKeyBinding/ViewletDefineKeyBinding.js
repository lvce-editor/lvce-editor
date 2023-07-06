import * as Viewlet from '../Viewlet/Viewlet.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    uri,
    value: '',
    focused: false,
  }
}

const getKeyBindingString = (key, altKey, ctrlKey, shiftKey, metaKey) => {
  let string = ''
  if (ctrlKey) {
    string += 'ctrl+'
  }
  if (altKey) {
    string += 'alt+'
  }
  if (shiftKey) {
    string += 'shift+'
  }
  string += key
  return string
}

export const handleKeyDown = (state, key, altKey, ctrlKey, shiftKey, metaKey) => {
  const { uid } = state
  if (key === 'Control' || key === 'Shift' || key === 'Alt') {
    return state
  }
  if (key === 'Enter') {
    Viewlet.disposeWidgetWithValue(uid, key)
    return state
  }
  if (key === 'Escape') {
    Viewlet.disposeWidgetWithValue(uid, '')
    return state
  }
  const keyBindingString = getKeyBindingString(key, altKey, ctrlKey, shiftKey, metaKey)
  return {
    ...state,
    value: keyBindingString,
  }
}

export const loadContent = (state) => {
  return {
    ...state,
    focused: true,
  }
}
