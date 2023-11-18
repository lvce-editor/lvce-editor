import * as Browser from '../Browser/Browser.js'
import * as Context from '../Context/Context.js'
import * as FocusState from '../FocusState/FocusState.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'

export const setFocus = async (focusKey) => {
  if (FocusState.get()) {
    Context.remove(FocusState.get())
  }
  FocusState.set(`focus.${focusKey}`)
  Context.set(FocusState.get(), true)
  KeyBindingsState.update()
}

export const setAdditionalFocus = (key) => {
  // TODO key should be numeric
  Context.set(`focus.${key}`, true)
}

export const removeAdditionalFocus = (key) => {
  Context.remove(`focus.${key}`)
}

export const hydrate = async () => {
  // TODO is this the right place for browser context ?
  // maybe in env file / env service
  const browser = Browser.getBrowser()
  Context.set(`browser.${browser}`, true)
  await RendererProcess.invoke('Focus.setContext', Context.getAll(), FocusState.get())
}
