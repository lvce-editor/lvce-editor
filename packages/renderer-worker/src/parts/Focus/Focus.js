import * as Assert from '../Assert/Assert.ts'
import * as Browser from '../Browser/Browser.js'
import * as Context from '../Context/Context.js'
import * as FocusState from '../FocusState/FocusState.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

/**
 * @param {number} focusKey
 * @param {number=} additionalFocusKey
 * @param {number=} uid - Optional: UID of the viewlet instance that is gaining focus
 * @param {string=} viewletModuleId - Optional: Module ID of the viewlet instance (e.g., 'EditorText', 'Explorer')
 */
export const setFocus = (focusKey, additionalFocusKey, uid, viewletModuleId) => {
  Assert.number(focusKey)
  if (FocusState.get()) {
    Context.remove(FocusState.get())
  }
  FocusState.set(focusKey)
  Context.set(FocusState.get(), true)
  if (additionalFocusKey) {
    Context.set(additionalFocusKey, true)
  }

  // Track the focused viewlet instance if provided
  if (typeof uid === 'number' && typeof viewletModuleId === 'string') {
    ViewletStates.setFocusedInstanceByType(uid, viewletModuleId)
  }

  KeyBindingsState.update()
}

/**
 * @param {number} key
 * @param {number=} uid - Optional: UID of the viewlet instance
 * @param {string=} viewletModuleId - Optional: Module ID of the viewlet instance
 */
export const setAdditionalFocus = (key, uid, viewletModuleId) => {
  Context.set(key, true)

  // Track the focused viewlet instance if provided
  if (typeof uid === 'number' && typeof viewletModuleId === 'string') {
    ViewletStates.setFocusedInstanceByType(uid, viewletModuleId)
  }

  KeyBindingsState.update()
}

/**
 * @param {number} key
 */
export const removeAdditionalFocus = (key) => {
  Context.remove(key)
  KeyBindingsState.update()
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
