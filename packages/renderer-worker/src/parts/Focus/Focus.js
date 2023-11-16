import * as Context from '../Context/Context.js'
import * as FocusState from '../FocusState/FocusState.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const setFocus = async (focusKey) => {
  if (FocusState.get()) {
    Context.remove(FocusState.get())
  }
  FocusState.set(`focus.${focusKey}`)
  Context.set(FocusState.get(), true)
  // TODO send matching keybindings to renderer process?
  await RendererProcess.invoke('Focus.setContext', Context.getAll(), FocusState.get())
}

export const setAdditionalFocus = (key) => {
  // TODO key should be numeric
  Context.set(`focus.${key}`, true)
}

export const removeAdditionalFocus = (key) => {
  Context.remove(`focus.${key}`)
}
