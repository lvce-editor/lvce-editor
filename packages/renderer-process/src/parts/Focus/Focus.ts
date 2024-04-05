import * as FocusState from '../FocusState/FocusState.ts'

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
    // @ts-ignore
    $Element.focus()
  }
}
