import * as Context from '../Context/Context.js'

// TODO not sure if its worth to have a separate module for this or keep it inside Context.js
// export const setFocus = (item) => {
//   if (Context.state.currentFocus) {
//     Context.remove(Context.state.currentFocus)
//   }
//   Context.set(`focus.${item}`, true)
// }

export const state = {
  $PreviousFocusElement: undefined,
  currentFocus: '',
}

export const setFocus = (key) => {
  if (state.currentFocus) {
    Context.remove(state.currentFocus)
  }
  // TODO could make focus key numeric enum which would be more efficient
  state.currentFocus = `focus.${key}`
  Context.set(state.currentFocus, true)
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
  state.$PreviousFocusElement = document.activeElement
  $Element.focus({ preventScroll: true })
  setFocus(key)
}

export const focusPrevious = () => {
  if (state.$PreviousFocusElement) {
    console.log(state.$PreviousFocusElement)
    state.$PreviousFocusElement.focus()
  }
}
