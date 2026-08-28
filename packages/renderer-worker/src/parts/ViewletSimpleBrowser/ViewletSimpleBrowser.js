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

const navigationHeaderHeight = 30
const tabsHeaderHeight = 35

const getHeaderHeight = (tabsEnabled) => navigationHeaderHeight + (tabsEnabled ? tabsHeaderHeight : 0)

const createTab = ({
  browserViewId,
  canGoBack = false,
  canGoForward = false,
  favicon = '',
  iframeSrc = '',
  inputValue = '',
  isAudioPlaying = false,
  isLoading = false,
  title = 'New Tab',
}) => ({
  browserViewId,
  canGoBack,
  canGoForward,
  favicon,
  iframeSrc,
  inputValue,
  isAudioPlaying,
  isLoading,
  title: title || 'New Tab',
})

const updateTab = (state, browserViewId, updates) => {
  const tabIndex = state.tabs.findIndex((tab) => tab.browserViewId === browserViewId)
  if (tabIndex === -1) {
    return state.tabs.length === 0 ? { ...state, ...updates } : state
  }
  const tabs = state.tabs.with(tabIndex, { ...state.tabs[tabIndex], ...updates })
  if (tabIndex !== state.selectedTabIndex) {
    return { ...state, tabs }
  }
  return {
    ...state,
    ...updates,
    tabs,
  }
}

const activateTab = (state, tabs, selectedTabIndex) => {
  const tab = tabs[selectedTabIndex]
  return {
    ...state,
    browserViewId: tab.browserViewId,
    canGoBack: tab.canGoBack,
    canGoForward: tab.canGoForward,
    iframeSrc: tab.iframeSrc,
    inputValue: tab.inputValue,
    isAudioPlaying: tab.isAudioPlaying,
    isLoading: tab.isLoading,
    selectedTabIndex,
    tabs,
    title: tab.title,
  }
}

const parseWebContentsEvent = (state, browserViewId, value) => {
  if (typeof browserViewId === 'number' || (typeof browserViewId === 'string' && /^\d+$/.test(browserViewId))) {
    return [Number(browserViewId), value]
  }
  return [state.browserViewId, browserViewId]
}

export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    uid: id,
    uri,
    x,
    y,
    width,
    height,
    focusAddressVersion: 0,
    headerHeight: getHeaderHeight(true),
    iframeSrc: '',
    inputValue: '',
    title: '',
    browserViewId: 0,
    canGoForward: true,
    canGoBack: true,
    isLoading: false,
    isAudioPlaying: false,
    hasSuggestionsOverlay: false,
    selectedSuggestionIndex: -1,
    suggestions: [],
    overlayIds: [],
    snapshot: '',
    suggestionsEnabled: false,
    shortcuts: [],
    tabs: [],
    tabsEnabled: true,
    selectedTabIndex: 0,
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
  const { x, y, width, height } = state
  const iframeSrc = getUrlFromSavedState(savedState)
  const shortcuts = SimpleBrowserPreferences.getShortCuts()
  const suggestionsEnabled = Preferences.get('simpleBrowser.suggestions')
  const tabsEnabled = Preferences.get('simpleBrowser.tabs.enabled') !== false
  const headerHeight = getHeaderHeight(tabsEnabled)
  // TODO since browser view is not visible at this point
  // it is not necessary to load keybindings for it
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  const fallThroughKeyBindings = GetFallThroughKeyBindings.getFallThroughKeyBindings(keyBindings)
  const browserViewId = await ElectronWebContentsView.createWebContentsView(0)
  await ElectronWebContentsViewFunctions.setFallthroughKeyBindings(fallThroughKeyBindings)
  Assert.number(browserViewId)
  await ElectronWebContentsViewFunctions.resizeWebContentsView(browserViewId, x, y + headerHeight, width, height - headerHeight)
  const { newTitle } = await ElectronWebContentsViewFunctions.setIframeSrc(browserViewId, iframeSrc)
  const title = newTitle || 'Simple Browser'
  const tabs = [createTab({ browserViewId, iframeSrc, inputValue: iframeSrc, title })]
  return {
    browserViewId,
    headerHeight,
    selectedTabIndex: 0,
    tabs,
    tabsEnabled,
    title,
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
  const { x, y, width, height, uri, uid } = state
  const idPart = uri.slice('simple-browser://'.length)
  const id = getId(idPart)
  const iframeSrc = getUrlFromSavedState(savedState)
  // TODO load keybindings in parallel with creating browserview
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  const suggestionsEnabled = Preferences.get('simpleBrowser.suggestions')
  const tabsEnabled = Preferences.get('simpleBrowser.tabs.enabled') !== false
  const headerHeight = getHeaderHeight(tabsEnabled)
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
    const stats = await ElectronWebContentsViewFunctions.getStats(actualId)
    const title = stats.title || 'Simple Browser'
    const tab = createTab({
      browserViewId: actualId,
      canGoBack: stats.canGoBack,
      canGoForward: stats.canGoForward,
      iframeSrc,
      inputValue: iframeSrc,
      title,
    })
    return {
      ...state,
      browserViewId: actualId,
      iframeSrc,
      inputValue: iframeSrc,
      canGoBack: stats.canGoBack,
      canGoForward: stats.canGoForward,
      headerHeight,
      selectedTabIndex: 0,
      suggestionsEnabled,
      shortcuts,
      tabs: [tab],
      tabsEnabled,
      title,
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
    headerHeight,
    selectedTabIndex: 0,
    suggestionsEnabled,
    shortcuts,
    tabs: [
      createTab({
        browserViewId,
        canGoBack,
        canGoForward,
        iframeSrc,
        inputValue: iframeSrc,
        title,
      }),
    ],
    tabsEnabled,
  }
}

export const show = async (state) => {
  const { browserViewId } = state
  await ElectronWebContentsViewFunctions.show(browserViewId)
}

export const hide = async (state) => {
  await Promise.all(state.tabs.map((tab) => ElectronWebContentsViewFunctions.hide(tab.browserViewId)))
}

const createEmptyTab = async (state) => {
  const { headerHeight, height, uid, width, x, y } = state
  const browserViewId = await ElectronWebContentsView.createWebContentsView(0, uid)
  await ElectronWebContentsViewFunctions.hide(browserViewId)
  await ElectronWebContentsViewFunctions.resizeWebContentsView(browserViewId, x, y + headerHeight, width, height - headerHeight)
  return createTab({ browserViewId })
}

export const createNewTab = async (state) => {
  if (!state.tabsEnabled) {
    return state
  }
  const currentState = state.hasSuggestionsOverlay ? await closeSuggestions(state) : state
  const tab = await createEmptyTab(currentState)
  if (currentState.browserViewId) {
    await ElectronWebContentsViewFunctions.hide(currentState.browserViewId)
  }
  await ElectronWebContentsViewFunctions.show(tab.browserViewId)
  const newState = activateTab(currentState, [...currentState.tabs, tab], currentState.tabs.length)
  return { ...newState, focusAddressVersion: newState.focusAddressVersion + 1 }
}

export const handleWindowOpen = async (state, browserViewId, url, disposition) => {
  const { hasSuggestionsOverlay, tabs: oldTabs, tabsEnabled } = state
  const ownsWebContentsView = oldTabs.some((tab) => tab.browserViewId === Number(browserViewId))
  const openExternalLinks = Preferences.get('simpleBrowser.openExternalLinks') === 'externalBrowser'
  if (!ownsWebContentsView) {
    return state
  }
  if (openExternalLinks || !tabsEnabled) {
    await Command.execute('Open.openExternal', url)
    return state
  }
  const currentState = hasSuggestionsOverlay ? await closeSuggestions(state) : state
  const emptyTab = await createEmptyTab(currentState)
  const tab = {
    ...emptyTab,
    iframeSrc: url,
    inputValue: url,
    isLoading: true,
  }
  void ElectronWebContentsViewFunctions.setIframeSrc(tab.browserViewId, url)
  const tabs = [...currentState.tabs, tab]
  if (disposition === 'background-tab') {
    return { ...currentState, tabs }
  }
  if (currentState.browserViewId) {
    await ElectronWebContentsViewFunctions.hide(currentState.browserViewId)
  }
  await ElectronWebContentsViewFunctions.show(tab.browserViewId)
  await ElectronWebContentsViewFunctions.focus(tab.browserViewId)
  return activateTab(currentState, tabs, currentState.tabs.length)
}

export const selectTab = async (state, index) => {
  const selectedTabIndex = Number(index)
  if (selectedTabIndex === state.selectedTabIndex || selectedTabIndex < 0 || selectedTabIndex >= state.tabs.length) {
    return state
  }
  let newState = state
  if (state.hasSuggestionsOverlay) {
    newState = await closeSuggestions(state)
  }
  const tab = newState.tabs[selectedTabIndex]
  await ElectronWebContentsViewFunctions.hide(newState.browserViewId)
  await ElectronWebContentsViewFunctions.show(tab.browserViewId)
  await ElectronWebContentsViewFunctions.focus(tab.browserViewId)
  return activateTab(newState, newState.tabs, selectedTabIndex)
}

export const closeTab = async (state, index) => {
  if (!state.tabsEnabled) {
    return state
  }
  const tabIndex = Number(index)
  if (tabIndex < 0 || tabIndex >= state.tabs.length) {
    return state
  }
  const currentState = tabIndex === state.selectedTabIndex && state.hasSuggestionsOverlay ? await closeSuggestions(state) : state
  const tab = currentState.tabs[tabIndex]
  if (currentState.tabs.length === 1) {
    const replacement = await createEmptyTab(currentState)
    await ElectronWebContentsView.disposeWebContentsView(tab.browserViewId)
    await ElectronWebContentsViewFunctions.show(replacement.browserViewId)
    const newState = activateTab(currentState, [replacement], 0)
    return { ...newState, focusAddressVersion: newState.focusAddressVersion + 1 }
  }
  const tabs = currentState.tabs.toSpliced(tabIndex, 1)
  const wasSelected = tabIndex === currentState.selectedTabIndex
  let selectedTabIndex = currentState.selectedTabIndex
  if (wasSelected) {
    selectedTabIndex = Math.min(tabIndex, tabs.length - 1)
  } else if (tabIndex < selectedTabIndex) {
    selectedTabIndex--
  }
  await ElectronWebContentsView.disposeWebContentsView(tab.browserViewId)
  if (!wasSelected) {
    return { ...currentState, selectedTabIndex, tabs }
  }
  const selectedTab = tabs[selectedTabIndex]
  await ElectronWebContentsViewFunctions.show(selectedTab.browserViewId)
  await ElectronWebContentsViewFunctions.focus(selectedTab.browserViewId)
  return activateTab(currentState, tabs, selectedTabIndex)
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
    ...updateTab(state, state.browserViewId, { inputValue: value }),
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
  return updateTab(state, state.browserViewId, {
    iframeSrc,
    inputValue: value,
    isLoading: true,
  })
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

  return updateTab(newState1, browserViewId, {
    iframeSrc,
    isLoading: true,
  })
}

export const go = async (state) => {
  if (state.hasSuggestionsOverlay && state.selectedSuggestionIndex >= 0) {
    return acceptSuggestion(state)
  }
  return navigate(state, state.inputValue)
}

export const handleWillNavigate = (state, browserViewId, value) => {
  const [actualBrowserViewId, url] = parseWebContentsEvent(state, browserViewId, value)
  return updateTab(state, actualBrowserViewId, {
    favicon: '',
    iframeSrc: url,
    isAudioPlaying: false,
    isLoading: true,
  })
}

export const handleKeyBinding = async (state, keyBinding) => {
  await KeyBindings.handleKeyBinding(keyBinding)
  return state
}

export const handleDidNavigate = (state, browserViewId, value) => {
  const [actualBrowserViewId, url] = parseWebContentsEvent(state, browserViewId, value)
  return updateTab(state, actualBrowserViewId, {
    iframeSrc: url,
    inputValue: url,
    isLoading: false,
  })
}

export const handleDidNavigationCancel = (state, browserViewId) => {
  const [actualBrowserViewId] = parseWebContentsEvent(state, browserViewId)
  return updateTab(state, actualBrowserViewId, {
    isLoading: false,
  })
}

export const handleTitleUpdated = async (state, browserViewId, value) => {
  const [actualBrowserViewId, title] = parseWebContentsEvent(state, browserViewId, value)
  const newState = updateTab(state, actualBrowserViewId, { title: title || 'New Tab' })
  if (actualBrowserViewId === state.browserViewId) {
    await GlobalEventBus.emitEvent('titleUpdated', state.uid, title)
  }
  return newState
}

export const handlePageFaviconUpdated = (state, browserViewId, favicons) => {
  const [actualBrowserViewId, actualFavicons] = parseWebContentsEvent(state, browserViewId, favicons)
  const favicon = Array.isArray(actualFavicons) ? actualFavicons[0] || '' : ''
  return updateTab(state, actualBrowserViewId, { favicon })
}

export const handleAudioStateChanged = (state, browserViewId, audible) => {
  const [actualBrowserViewId, isAudioPlaying] = parseWebContentsEvent(state, browserViewId, audible)
  return updateTab(state, actualBrowserViewId, { isAudioPlaying: Boolean(isAudioPlaying) })
}

export const dispose = async (state) => {
  await Promise.all(state.tabs.map((tab) => ElectronWebContentsView.disposeWebContentsView(tab.browserViewId)))
}
