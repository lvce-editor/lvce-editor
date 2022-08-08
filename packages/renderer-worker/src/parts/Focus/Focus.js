import * as Context from '../Context/Context.js'

// TODO not sure if its worth to have a separate module for this or keep it inside Context.js
// export const setFocus = (item) => {
//   if (Context.state.currentFocus) {
//     Context.remove(Context.state.currentFocus)
//   }
//   Context.set(`focus.${item}`, true)
// }

export const state = {
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

export const focus = (key) => {
  setFocus(key)
}

export const get = () => {
  return state.currentFocus.slice('focus.'.length)
}
