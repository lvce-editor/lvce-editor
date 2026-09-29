import * as BrowserKey from '../BrowserKey/BrowserKey.js'
import * as GetKeyBindingsString from '../GetKeyBindingsString/GetKeyBindingsString.js'
import * as KeyBindingsStrings from '../KeyBindingStrings/KeyBindingStrings.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const create = (id, uri, x, y, width, height, args = []) => {
  return {
    id,
    uri,
    parentUid: args[0],
    value: '',
    focused: false,
    message: '',
  }
}

export const loadContent = (state) => {
  return {
    ...state,
    focused: true,
    message: KeyBindingsStrings.pressDesiredKeyCombinationThenPressEnter(),
  }
}

const dispose = async (state, value) => {
  const { uid } = state
  await Viewlet.disposeWidgetWithValue(uid, value)
  return state
}

export const handleBlur = async (state) => {
  return dispose(state, '')
}

export const handleKeyDown = async (state, key, altKey, ctrlKey, shiftKey, metaKey) => {
  // TODO handle with keybindings?
  if (key === BrowserKey.Control || key === BrowserKey.Shift || key === BrowserKey.Alt) {
    return state
  }
  if (key === BrowserKey.Enter) {
    return dispose(state, state.value)
  }
  if (key === BrowserKey.Escape) {
    return dispose(state, '')
  }
  const keyBindingString = GetKeyBindingsString.getKeyBindingString(key, altKey, ctrlKey, shiftKey, metaKey)
  return {
    ...state,
    value: keyBindingString,
  }
}
