import * as Context from '../Context/Context.js'
import * as FocusState from '../FocusState/FocusState.js'

export const setContext = (contexts, current) => {
  Context.state.contexts = contexts
  FocusState.set(current)
}

export const setAdditionalFocus = (key) => {
  // TODO key should be numeric
  Context.set(`focus.${key}`, true)
}

export const removeAdditionalFocus = (key) => {
  Context.remove(`focus.${key}`)
}

export const focus = ($Element) => {
  if ($Element === document.activeElement) {
    return
  }
  FocusState.setElement(document.activeElement)
  $Element.focus({ preventScroll: true })
}

export const focusPrevious = () => {
  const $Element = FocusState.getElement()
  if ($Element) {
    $Element.focus()
  }
}
