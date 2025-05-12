// based on vscode's simple browser by Microsoft (https://github.com/microsoft/vscode/blob/e8fe2d07d31f30698b9262dd5e1fcc59a85c6bb1/extensions/simple-browser/src/extension.ts, License MIT)

import * as Assert from '../Assert/Assert.ts'
import * as ElectronWebContentsView from '../ElectronWebContentsView/ElectronWebContentsView.js'
import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'
import * as GetFallThroughKeyBindings from '../GetFallThroughKeyBindings/GetFallThroughKeyBindings.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as IframeSrc from '../IframeSrc/IframeSrc.js'
import * as IsEmptyString from '../IsEmptyString/IsEmptyString.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as KeyBindingsInitial from '../KeyBindingsInitial/KeyBindingsInitial.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SimpleBrowserPreferences from '../SimpleBrowserPreferences/SimpleBrowserPreferences.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    uid: id,
    uri,
    x,
    y,
    width,
    height,
    headerHeight: 30,
    iframeSrc: '',
    inputValue: '',
    title: '',
    browserViewId: 0,
    canGoForward: true,
    canGoBack: true,
    isLoading: false,
    hasSuggestionsOverlay: false,
    suggestionsEnabled: false,
    shortcuts: [],
  }
}

export const saveState = (state) => {
  const { iframeSrc } = state
  return {
    iframeSrc,
  }
}

const getUrlFromSavedState = (savedState) => {
  if (savedState && savedState.iframeSrc) {
    return savedState.iframeSrc
  }
  return SimpleBrowserPreferences.getDefaultUrl()
}

export const backgroundLoadContent = async (state, savedState) => {
  // TODO duplicate code with loadContent
  const { x, y, width, height, headerHeight } = state
  const iframeSrc = getUrlFromSavedState(savedState)
  const shortcuts = SimpleBrowserPreferences.getShortCuts()
  // TODO since browser view is not visible at this point
  // it is not necessary to load keybindings for it
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  const fallThroughKeyBindings = GetFallThroughKeyBindings.getFallThroughKeyBindings(keyBindings)
  const browserViewId = await ElectronWebContentsView.createWebContentsView(0)
  await ElectronWebContentsViewFunctions.setFallthroughKeyBindings(fallThroughKeyBindings)
  Assert.number(browserViewId)
  await ElectronWebContentsViewFunctions.resizeWebContentsView(browserViewId, x, y + headerHeight, width, height - headerHeight)
  const { newTitle } = await ElectronWebContentsViewFunctions.setIframeSrc(browserViewId, iframeSrc)
  return {
    title: newTitle,
    uri: `simple-browser://${browserViewId}`,
    iframeSrc,
    shortcuts,
  }
}

const getId = (idPart) => {
  if (!idPart) {
    return 0
  }
  return Number.parseInt(idPart)
}

export const loadContent = async (state, savedState) => {
  const { x, y, width, height, headerHeight, uri, uid } = state
  const idPart = uri.slice('simple-browser://'.length)
  const id = getId(idPart)
  const iframeSrc = getUrlFromSavedState(savedState)
  // TODO load keybindings in parallel with creating browserview
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  const suggestionsEnabled = Preferences.get('simpleBrowser.suggestions')
  const browserViewX = x
  const browserViewY = y + headerHeight
  const browserViewWidth = width
  const browserViewHeight = height - headerHeight
  const shortcuts = SimpleBrowserPreferences.getShortCuts()

  if (id) {
    const actualId = await ElectronWebContentsView.createWebContentsView(id, uid)
    await ElectronWebContentsViewFunctions.setFallthroughKeyBindings(keyBindings)
    await ElectronWebContentsViewFunctions.resizeWebContentsView(actualId, browserViewX, browserViewY, browserViewWidth, browserViewHeight)
    if (id !== actualId) {
      await ElectronWebContentsViewFunctions.setIframeSrc(actualId, iframeSrc)
    }
    return {
      ...state,
      iframeSrc,
      title: 'Simple Browser',
      browserViewId: actualId,
      suggestionsEnabled,
      shortcuts,
    }
  }

  const fallThroughKeyBindings = GetFallThroughKeyBindings.getFallThroughKeyBindings(keyBindings)
  const browserViewId = await ElectronWebContentsView.createWebContentsView(/* restoreId */ 0, uid)
  await ElectronWebContentsViewFunctions.setFallthroughKeyBindings(fallThroughKeyBindings)
  await ElectronWebContentsViewFunctions.resizeWebContentsView(browserViewId, browserViewX, browserViewY, browserViewWidth, browserViewHeight)
  Assert.number(browserViewId)
  await ElectronWebContentsViewFunctions.setIframeSrc(browserViewId, iframeSrc)
  const { title, canGoBack, canGoForward } = await ElectronWebContentsViewFunctions.getStats(browserViewId)
  return {
    ...state,
    iframeSrc,
    title,
    browserViewId,
    canGoBack,
    canGoForward,
    uri: `simple-browser://${browserViewId}`,
    suggestionsEnabled,
    shortcuts,
  }
}

export const show = async (state) => {
  const { browserViewId } = state
  await ElectronWebContentsViewFunctions.show(browserViewId)
}

export const hide = async (state) => {
  const { browserViewId } = state
  await ElectronWebContentsViewFunctions.hide(browserViewId)
}

export const handleInput = async (state, value) => {
  const { hasSuggestionsOverlay, suggestionsEnabled } = state
  if (suggestionsEnabled) {
    if (IsEmptyString.isEmptyString(value) && hasSuggestionsOverlay) {
      return {
        ...state,
        inputValue: value,
        hasSuggestionsOverlay: false,
      }
    }
    // TODO maybe show autocomplete for urls like browsers do
  }
  return {
    ...state,
    inputValue: value,
    hasSuggestionsOverlay: true,
  }
}

export const setUrl = async (state, value) => {
  const newState1 = await handleInput(state, value)
  const { inputValue, browserViewId, shortcuts } = newState1
  const iframeSrc = IframeSrc.toIframeSrc(inputValue, shortcuts)
  // TODO await promises
  await ElectronWebContentsViewFunctions.setIframeSrc(browserViewId, iframeSrc)

  return {
    ...newState1,
    iframeSrc,
    isLoading: true,
  }
}

export const go = (state) => {
  const { inputValue, browserViewId, suggestionsEnabled, hasSuggestionsOverlay, shortcuts } = state
  const iframeSrc = IframeSrc.toIframeSrc(inputValue, shortcuts)
  // TODO await promises
  void ElectronWebContentsViewFunctions.setIframeSrc(browserViewId, iframeSrc)
  void ElectronWebContentsViewFunctions.focus(browserViewId)
  if (suggestionsEnabled && hasSuggestionsOverlay) {
    // void ElectronBrowserViewSuggestions.disposeBrowserView()
  }
  return {
    ...state,
    iframeSrc,
    isLoading: true,
  }
}

export const handleWillNavigate = (state, url) => {
  return {
    ...state,
    iframeSrc: url,
    isLoading: true,
  }
}

export const handleKeyBinding = async (state, keyBinding) => {
  await KeyBindings.handleKeyBinding(keyBinding)
  return state
}

export const handleDidNavigate = (state, url) => {
  return {
    ...state,
    iframeSrc: url,
    isLoading: false,
  }
}

export const handleDidNavigationCancel = (state, url) => {
  return {
    ...state,
    isLoading: false,
  }
}

export const handleTitleUpdated = async (state, title) => {
  const { uid } = state
  await GlobalEventBus.emitEvent('titleUpdated', uid, title)
  return state
}

export const dispose = async (state) => {
  const { browserViewId } = state
  await ElectronWebContentsView.disposeWebContentsView(browserViewId)
}
