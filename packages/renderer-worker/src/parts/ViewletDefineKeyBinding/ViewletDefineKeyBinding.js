import * as BrowserKey from '../BrowserKey/BrowserKey.js'
import * as ViewletKeyBindingsStrings from '../ViewletKeyBindings/ViewletKeyBindingsStrings.js'
import * as GetKeyBindingsString from '../GetKeyBindingsString/GetKeyBindingsString.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    uri,
    value: '',
    focused: false,
    message: '',
  }
}

export const loadContent = (state) => {
  return {
    ...state,
    focused: true,
    message: ViewletKeyBindingsStrings.pressDesiredKeyCombinationThenPressEnter(),
  }
}

const dispose = (state, value) => {
  const { uid } = state
  Viewlet.disposeWidgetWithValue(uid, value)
  return state
}

export const handleBlur = (state) => {
  return dispose(state, '')
}

export const handleKeyDown = (state, key, altKey, ctrlKey, shiftKey, metaKey) => {
  if (key === BrowserKey.Control || key === BrowserKey.Shift || key === BrowserKey.Alt) {
    return state
  }
  if (key === BrowserKey.Enter) {
    return dispose(state, key)
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
