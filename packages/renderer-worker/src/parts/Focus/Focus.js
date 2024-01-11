import * as Assert from '../Assert/Assert.js'
import * as Browser from '../Browser/Browser.js'
import * as Context from '../Context/Context.js'
import * as FocusState from '../FocusState/FocusState.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const setFocus = (focusKey) => {
  Assert.number(focusKey)
  if (FocusState.get()) {
    Context.remove(FocusState.get())
  }
  FocusState.set(focusKey)
  Context.set(FocusState.get(), true)
  KeyBindingsState.update()
}

export const setAdditionalFocus = (key) => {
  // TODO key should be numeric
  Context.set(key, true)
  KeyBindingsState.update()
}

export const removeAdditionalFocus = (key) => {
  Context.remove(key)
}

const getBrowserContextString = (browser) => {
  switch (browser) {
    case 'electron':
      return WhenExpression.BrowserElectron
    case 'firefox':
      return WhenExpression.BrowserFirefox
    case 'chromium':
      return WhenExpression.BrowserChromium
    default:
      return WhenExpression.Empty
  }
}

export const hydrate = async () => {
  // TODO is this the right place for browser context ?
  // maybe in env file / env service
  const browser = Browser.getBrowser()
  const key = getBrowserContextString(browser)
  Context.set(key, true)
  KeyBindingsState.update()
}
