import * as FocusState from '../FocusState/FocusState.js'

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
