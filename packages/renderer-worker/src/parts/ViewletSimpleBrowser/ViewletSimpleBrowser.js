// based on vscode's simple browser by Microsoft (https://github.com/microsoft/vscode/blob/e8fe2d07d31f30698b9262dd5e1fcc59a85c6bb1/extensions/simple-browser/src/extension.ts, License MIT)

import * as Assert from '../Assert/Assert.js'
import * as BrowserSearchSuggestions from '../BrowserSearchSuggestions/BrowserSearchSuggestions.js'
import * as ElectronBrowserView from '../ElectronBrowserView/ElectronBrowserView.js'
import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
import * as ElectronBrowserViewSuggestions from '../ElectronBrowserViewSuggestions/ElectronBrowserViewSuggestions.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as IframeSrc from '../IframeSrc/IframeSrc.js'
import * as IsEmptyString from '../IsEmptyString/IsEmptyString.js'
import * as KeyBindingsInitial from '../KeyBindingsInitial/KeyBindingsInitial.js'
import * as Preferences from '../Preferences/Preferences.js'

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
  }
}

const isFallThroughKeyBinding = (keyBinding) => {
  return !keyBinding.when
}

const getFallThroughKeyBindings = (keyBindings) => {
  return keyBindings.filter(isFallThroughKeyBinding)
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
  return 'https://example.com'
}

export const backgroundLoadContent = async (state, savedState) => {
  // TODO duplicate code with loadContent
  const { x, y, width, height, headerHeight } = state
  const iframeSrc = getUrlFromSavedState(savedState)
  // TODO since browser view is not visible at this point
  // it is not necessary to load keybindings for it
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  const fallThroughKeyBindings = getFallThroughKeyBindings(keyBindings)
  const browserViewId = await ElectronBrowserView.createBrowserView(0)
  await ElectronBrowserViewFunctions.setFallthroughKeyBindings(fallThroughKeyBindings)
  Assert.number(browserViewId)
  await ElectronBrowserViewFunctions.resizeBrowserView(browserViewId, x, y + headerHeight, width, height - headerHeight)
  const { newTitle } = await ElectronBrowserViewFunctions.setIframeSrc(browserViewId, iframeSrc)
  return {
    title: newTitle,
    uri: `simple-browser://${browserViewId}`,
    iframeSrc,
  }
}

const getId = (idPart) => {
  if (!idPart) {
    return 0
  }
  return parseInt(idPart)
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
  if (id) {
    const actualId = await ElectronBrowserView.createBrowserView(id, uid)
    await ElectronBrowserViewFunctions.setFallthroughKeyBindings(keyBindings)
    await ElectronBrowserViewFunctions.resizeBrowserView(actualId, browserViewX, browserViewY, browserViewWidth, browserViewHeight)
    if (id !== actualId) {
      await ElectronBrowserViewFunctions.setIframeSrc(actualId, iframeSrc)
    }
    return {
      ...state,
      iframeSrc,
      title: 'Simple Browser',
      browserViewId: actualId,
      suggestionsEnabled,
    }
  }

  const fallThroughKeyBindings = getFallThroughKeyBindings(keyBindings)
  const browserViewId = await ElectronBrowserView.createBrowserView(/* restoreId */ 0, uid)
  await ElectronBrowserViewFunctions.setFallthroughKeyBindings(fallThroughKeyBindings)
  await ElectronBrowserViewFunctions.resizeBrowserView(browserViewId, browserViewX, browserViewY, browserViewWidth, browserViewHeight)
  Assert.number(browserViewId)
  await ElectronBrowserViewFunctions.setIframeSrc(browserViewId, iframeSrc)
  const { title, canGoBack, canGoForward } = await ElectronBrowserViewFunctions.getStats(browserViewId)
  return {
    ...state,
    iframeSrc,
    title,
    browserViewId,
    canGoBack,
    canGoForward,
    uri: `simple-browser://${browserViewId}`,
    suggestionsEnabled,
  }
}

export const show = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.show(browserViewId)
}

export const hide = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.hide(browserViewId)
}

export const handleInput = async (state, value) => {
  const { x, y, width, height, hasSuggestionsOverlay, suggestionsEnabled, headerHeight } = state
  if (suggestionsEnabled) {
    if (IsEmptyString.isEmptyString(value) && hasSuggestionsOverlay) {
      await ElectronBrowserViewSuggestions.disposeBrowserView()
      return {
        ...state,
        inputValue: value,
        hasSuggestionsOverlay: false,
      }
    } else {
      // TODO maybe show autocomplete for urls like browsers do
      const suggestions = await BrowserSearchSuggestions.get(value)
      if (!hasSuggestionsOverlay) {
        await ElectronBrowserViewSuggestions.createBrowserView(x + 70, y + headerHeight, 400, 400)
      }
      await ElectronBrowserViewSuggestions.setSuggestions(suggestions)
    }
  }
  return {
    ...state,
    inputValue: value,
    hasSuggestionsOverlay: true,
  }
}

export const go = (state) => {
  const { inputValue, browserViewId, suggestionsEnabled, hasSuggestionsOverlay } = state
  const iframeSrc = IframeSrc.toIframeSrc(inputValue)
  // TODO await promises
  void ElectronBrowserViewFunctions.setIframeSrc(browserViewId, iframeSrc)
  void ElectronBrowserViewFunctions.focus(browserViewId)
  if (suggestionsEnabled && hasSuggestionsOverlay) {
    void ElectronBrowserViewSuggestions.disposeBrowserView()
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
  const { browserViewId, suggestionsEnabled, hasSuggestionsOverlay } = state
  await ElectronBrowserView.disposeBrowserView(browserViewId)
  if (suggestionsEnabled && hasSuggestionsOverlay) {
    await ElectronBrowserViewSuggestions.disposeBrowserView()
  }
}
