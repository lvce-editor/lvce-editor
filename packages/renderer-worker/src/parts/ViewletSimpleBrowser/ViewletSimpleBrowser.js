// based on vscode's simple browser by Microsoft (https://github.com/microsoft/vscode/blob/e8fe2d07d31f30698b9262dd5e1fcc59a85c6bb1/extensions/simple-browser/src/extension.ts, License MIT)

import * as Assert from '../Assert/Assert.ts'
import * as BrowserSearchSuggestions from '../BrowserSearchSuggestions/BrowserSearchSuggestions.js'
import * as Command from '../Command/Command.js'
import * as ElectronWebContentsView from '../ElectronWebContentsView/ElectronWebContentsView.js'
import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'
import * as GetFallThroughKeyBindings from '../GetFallThroughKeyBindings/GetFallThroughKeyBindings.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as IframeSrc from '../IframeSrc/IframeSrc.js'
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
    selectedSuggestionIndex: -1,
    suggestions: [],
    overlayIds: [],
    snapshot: '',
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
  const suggestionsEnabled = Preferences.get('simpleBrowser.suggestions')
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
    inputValue: iframeSrc,
    suggestionsEnabled,
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
      inputValue: iframeSrc,
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
    inputValue: iframeSrc,
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

export const showOverlay = async (state, overlayId) => {
  if (state.overlayIds.includes(overlayId)) {
    return state
  }
  const overlayIds = [...state.overlayIds, overlayId]
  if (state.snapshot) {
    return {
      ...state,
      overlayIds,
    }
  }
  try {
    const snapshot = await ElectronWebContentsViewFunctions.capturePage(state.browserViewId)
    await ElectronWebContentsViewFunctions.hide(state.browserViewId)
    return {
      ...state,
      overlayIds,
      snapshot,
    }
  } catch (error) {
    console.error('[renderer-worker] Failed to capture Simple Browser page', error)
    return state
  }
}

export const hideOverlay = async (state, overlayId) => {
  if (!state.overlayIds.includes(overlayId)) {
    return state
  }
  const overlayIds = state.overlayIds.filter((id) => id !== overlayId)
  if (overlayIds.length > 0) {
    return {
      ...state,
      overlayIds,
    }
  }
  try {
    await ElectronWebContentsViewFunctions.show(state.browserViewId)
  } catch (error) {
    console.error('[renderer-worker] Failed to restore Simple Browser page', error)
  }
  return {
    ...state,
    overlayIds,
    snapshot: '',
  }
}

export const handleInput = async (state, value) => {
  const newState = {
    ...state,
    inputValue: value,
    selectedSuggestionIndex: -1,
  }
  if (!state.suggestionsEnabled || !shouldRequestSuggestions(value)) {
    if (state.hasSuggestionsOverlay) {
      void Command.execute('SimpleBrowser.closeSuggestions')
    }
    return newState
  }
  void requestSuggestions(state.uid, value)
  return newState
}

const suggestionsOverlayId = 'search-suggestions'

const shouldRequestSuggestions = (value) => {
  const query = value.trim()
  if (query.length < 2) {
    return false
  }
  return !/^(?:[a-z][a-z\d+.-]*:\/\/|localhost(?::\d+)?(?:\/|$)|\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:\/|$))/i.test(query)
}

const requestSuggestions = async (uid, query) => {
  let suggestions = []
  try {
    suggestions = await BrowserSearchSuggestions.get(query)
  } catch {
    // Provider failures should leave normal address-bar navigation available.
  }
  await Command.execute('SimpleBrowser.applySuggestions', uid, query, suggestions)
}

export const applySuggestions = async (state, uid, query, suggestions) => {
  if (state.uid !== uid || state.inputValue !== query || !state.suggestionsEnabled) {
    return state
  }
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return closeSuggestions(state)
  }
  const uniqueSuggestions = [query, ...suggestions.filter((suggestion) => suggestion !== query)].slice(0, 8)
  const overlayState = await showOverlay(state, suggestionsOverlayId)
  if (!overlayState.overlayIds.includes(suggestionsOverlayId)) {
    return state
  }
  return {
    ...overlayState,
    hasSuggestionsOverlay: true,
    selectedSuggestionIndex: 0,
    suggestions: uniqueSuggestions,
  }
}

export const closeSuggestions = async (state) => {
  const overlayState = state.hasSuggestionsOverlay ? await hideOverlay(state, suggestionsOverlayId) : state
  return {
    ...overlayState,
    hasSuggestionsOverlay: false,
    selectedSuggestionIndex: -1,
    suggestions: [],
  }
}

export const selectNextSuggestion = (state) => {
  if (!state.hasSuggestionsOverlay || state.suggestions.length === 0) {
    return state
  }
  return {
    ...state,
    selectedSuggestionIndex: Math.min(state.selectedSuggestionIndex + 1, state.suggestions.length - 1),
  }
}

export const selectPreviousSuggestion = (state) => {
  if (!state.hasSuggestionsOverlay || state.suggestions.length === 0) {
    return state
  }
  return {
    ...state,
    selectedSuggestionIndex: Math.max(state.selectedSuggestionIndex - 1, 0),
  }
}

const navigate = (state, value) => {
  const iframeSrc = IframeSrc.toIframeSrc(value, state.shortcuts)
  void ElectronWebContentsViewFunctions.setIframeSrc(state.browserViewId, iframeSrc)
  void ElectronWebContentsViewFunctions.focus(state.browserViewId)
  return {
    ...state,
    iframeSrc,
    inputValue: value,
    isLoading: true,
  }
}

export const acceptSuggestion = async (state, value) => {
  const suggestion = typeof value === 'string' ? value : state.suggestions[state.selectedSuggestionIndex]
  if (typeof suggestion !== 'string') {
    return state
  }
  const newState = await closeSuggestions(state)
  return navigate(newState, suggestion)
}

export const setUrl = async (state, value) => {
  const newState1 = await handleInput(state, value)
  const { inputValue, browserViewId, shortcuts } = newState1
  const iframeSrc = IframeSrc.toIframeSrc(inputValue, shortcuts)
  void ElectronWebContentsViewFunctions.setIframeSrc(browserViewId, iframeSrc)

  return {
    ...newState1,
    iframeSrc,
    isLoading: true,
  }
}

export const go = async (state) => {
  if (state.hasSuggestionsOverlay && state.selectedSuggestionIndex >= 0) {
    return acceptSuggestion(state)
  }
  return navigate(state, state.inputValue)
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
    inputValue: url,
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
