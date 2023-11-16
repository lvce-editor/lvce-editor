import * as Context from '../Context/Context.js'
import * as FocusState from '../FocusState/FocusState.js'

export const setFocus = (key) => {
  if (FocusState.get()) {
    Context.remove(FocusState.get())
  }
  // TODO could make focus key numeric enum which would be more efficient
  FocusState.set(`focus. ${key}`)
  Context.set(FocusState.get(), true)
}

export const setAdditionalFocus = (key) => {
  // TODO key should be numeric
  Context.set(`focus.${key}`, true)
}

export const removeAdditionalFocus = (key) => {
  Context.remove(`focus.${key}`)
}

export const focus = ($Element, key) => {
  if ($Element === document.activeElement) {
    return
  }
  FocusState.setElement(document.activeElement)
  $Element.focus({ preventScroll: true })
  setFocus(key)
}

export const focusPrevious = () => {
  const $Element = FocusState.getElement()
  if ($Element) {
    $Element.focus()
  }
}
