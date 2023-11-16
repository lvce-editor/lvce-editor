import * as Context from '../Context/Context.js'
import * as FocusState from '../FocusState/FocusState.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const setFocus = async (focusKey) => {
  FocusState.set(focusKey)
  // TODO send matching keybindings to renderer process?
  await RendererProcess.invoke('Focus.setFocus', focusKey)
}

export const setAdditionalFocus = (key) => {
  // TODO key should be numeric
  Context.set(`focus.${key}`, true)
}

export const removeAdditionalFocus = (key) => {
  Context.remove(`focus.${key}`)
}
