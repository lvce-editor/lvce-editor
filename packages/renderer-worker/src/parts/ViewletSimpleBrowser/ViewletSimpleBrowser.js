// based on vscode's simple browser by Microsoft (https://github.com/microsoft/vscode/blob/e8fe2d07d31f30698b9262dd5e1fcc59a85c6bb1/extensions/simple-browser/src/extension.ts, License MIT)

import * as Assert from '../Assert/Assert.ts'
import * as BrowserSearchSuggestions from '../BrowserSearchSuggestions/BrowserSearchSuggestions.js'
import * as BrowserHistory from '../BrowserHistory/BrowserHistory.js'
import * as BrowserVisitedSites from '../BrowserVisitedSites/BrowserVisitedSites.js'
import * as Command from '../Command/Command.js'
import * as ElectronWebContentsView from '../ElectronWebContentsView/ElectronWebContentsView.js'
import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Focus from '../Focus/Focus.js'
import * as GetFallThroughKeyBindings from '../GetFallThroughKeyBindings/GetFallThroughKeyBindings.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as IframeSrc from '../IframeSrc/IframeSrc.js'
import * as InputName from '../InputName/InputName.js'
import * as KeyCode from '../KeyCode/KeyCode.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as KeyModifier from '../KeyModifier/KeyModifier.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as PrettyBytes from '../PrettyBytes/PrettyBytes.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SimpleBrowserNewTabPage from '../SimpleBrowserNewTabPage/SimpleBrowserNewTabPage.js'
import * as SimpleBrowserPageSnapshot from '../SimpleBrowserPageSnapshot/SimpleBrowserPageSnapshot.js'
import * as SimpleBrowserPreferences from '../SimpleBrowserPreferences/SimpleBrowserPreferences.js'
import * as SimpleBrowserSnapshot from '../SimpleBrowserSnapshot/SimpleBrowserSnapshot.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

const navigationHeaderHeight = 30
const tabsHeaderHeight = 35
const closeTabKeyBinding = KeyModifier.CtrlCmd | KeyCode.KeyW
const createNewTabKeyBinding = KeyModifier.CtrlCmd | KeyCode.KeyT
const focusNextTabKeyBinding = KeyModifier.CtrlCmd | KeyCode.Tab
const focusPreviousTabKeyBinding = KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.Tab
const openHistoryKeyBinding = KeyModifier.CtrlCmd | KeyCode.KeyH
const browserTabKeyBindings = [closeTabKeyBinding, createNewTabKeyBinding, focusNextTabKeyBinding, focusPreviousTabKeyBinding, openHistoryKeyBinding]
const visibleBrowserUids = new Set()

const getFallThroughKeyBindings = () => {
  const keyBindings = KeyBindingsState.getKeyBindings()
  return [...new Set([...GetFallThroughKeyBindings.getFallThroughKeyBindings(keyBindings), ...browserTabKeyBindings])]
}

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
  muted = false,
  pageSnapshot = undefined,
  title = 'New Tab',
  zoomLevel = 0,
}) => ({
  browserViewId,
  canGoBack,
  canGoForward,
  favicon,
  iframeSrc,
  inputValue,
  isAudioPlaying,
  isLoading,
  muted,
  pageSnapshot,
  title: title || 'New Tab',
  zoomLevel,
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
    muted: tab.muted,
    selectedTabIndex,
    tabs,
    title: tab.title,
    zoomLevel: tab.zoomLevel,
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
    isAudioPlaying: false,
    isLoading: false,
    muted: false,
    hasSuggestionsOverlay: false,
    selectedSuggestionIndex: -1,
    suggestions: [],
    overlayIds: [],
    snapshot: '',
    suggestionsEnabled: false,
    shortcuts: [],
    tabs: [],
    audioIndicatorEnabled: true,
    tabsEnabled: true,
    unloadTabs: false,
    selectedTabIndex: 0,
    tabHover: undefined,
    tabHoverEnabled: false,
    zoomLevel: 0,
    visitedSites: [],
  }
}

export const saveState = (state) => {
  const { iframeSrc, selectedTabIndex, tabs } = state
  return {
    iframeSrc,
    selectedTabIndex,
    tabs: tabs.map((tab) => ({
      favicon: tab.favicon,
      iframeSrc: tab.iframeSrc,
      inputValue: tab.inputValue,
      title: tab.title,
    })),
  }
}

const getTabsFromSavedState = (savedState) => {
  if (!Array.isArray(savedState?.tabs)) {
    return []
  }
  return savedState.tabs
    .filter((tab) => tab && typeof tab === 'object')
    .map((tab) => {
      const iframeSrc = typeof tab.iframeSrc === 'string' ? tab.iframeSrc : ''
      return createTab({
        browserViewId: 0,
        favicon: typeof tab.favicon === 'string' ? tab.favicon : '',
        iframeSrc,
        inputValue: typeof tab.inputValue === 'string' ? tab.inputValue : iframeSrc,
        title: typeof tab.title === 'string' ? tab.title : 'New Tab',
      })
    })
}

const getSavedSelectedTabIndex = (savedState, tabs) => {
  if (tabs.length === 0 || !Number.isInteger(savedState?.selectedTabIndex)) {
    return 0
  }
  return Math.max(0, Math.min(savedState.selectedTabIndex, tabs.length - 1))
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
  const audioIndicatorEnabled = Preferences.get('simpleBrowser.audioIndicator.enabled') !== false
  const suggestionsEnabled = Preferences.get('simpleBrowser.suggestions')
  const tabsEnabled = Preferences.get('simpleBrowser.tabs.enabled') !== false
  const tabHoverEnabled = Preferences.get('simpleBrowser.tabHover.enabled') === true
  const unloadTabs = Preferences.get('simpleBrowser.unloadTabs') === true
  const headerHeight = getHeaderHeight(tabsEnabled)
  const visitedSites = await BrowserVisitedSites.load()
  const browserViewId = await ElectronWebContentsView.createWebContentsView(0)
  Assert.number(browserViewId)
  await ElectronWebContentsViewFunctions.resizeWebContentsView(browserViewId, x, y + headerHeight, width, height - headerHeight)
  const { newTitle } = await ElectronWebContentsViewFunctions.setIframeSrc(browserViewId, iframeSrc || SimpleBrowserNewTabPage.getUrl())
  const title = newTitle || 'Simple Browser'
  const tabs = [createTab({ browserViewId, iframeSrc, inputValue: iframeSrc, title })]
  return {
    browserViewId,
    audioIndicatorEnabled,
    headerHeight,
    selectedTabIndex: 0,
    tabs,
    tabsEnabled,
    tabHoverEnabled,
    unloadTabs,
    title,
    zoomLevel: 0,
    visitedSites,
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
  const savedTabs = getTabsFromSavedState(savedState)
  const savedSelectedTabIndex = getSavedSelectedTabIndex(savedState, savedTabs)
  const savedSelectedTab = savedTabs[savedSelectedTabIndex]
  const iframeSrc = savedSelectedTab ? savedSelectedTab.iframeSrc : getUrlFromSavedState(savedState)
  const visitedSites = await BrowserVisitedSites.load()
  const audioIndicatorEnabled = Preferences.get('simpleBrowser.audioIndicator.enabled') !== false
  const suggestionsEnabled = Preferences.get('simpleBrowser.suggestions')
  const tabsEnabled = Preferences.get('simpleBrowser.tabs.enabled') !== false
  const tabHoverEnabled = Preferences.get('simpleBrowser.tabHover.enabled') === true
  const unloadTabs = Preferences.get('simpleBrowser.unloadTabs') === true
  const headerHeight = getHeaderHeight(tabsEnabled)
  const browserViewX = x
  const browserViewY = y + headerHeight
  const browserViewWidth = width
  const browserViewHeight = height - headerHeight
  const shortcuts = SimpleBrowserPreferences.getShortCuts()
  const fallThroughKeyBindings = getFallThroughKeyBindings()

  const browserViewId = await ElectronWebContentsView.createWebContentsView(id, uid)
  await ElectronWebContentsViewFunctions.setFallthroughKeyBindings(browserViewId, fallThroughKeyBindings)
  await ElectronWebContentsViewFunctions.resizeWebContentsView(browserViewId, browserViewX, browserViewY, browserViewWidth, browserViewHeight)
  Assert.number(browserViewId)
  if (!iframeSrc || !id || id !== browserViewId) {
    await ElectronWebContentsViewFunctions.setIframeSrc(browserViewId, iframeSrc || SimpleBrowserNewTabPage.getUrl())
  }
  const { title, canGoBack, canGoForward, isAudioMuted } = await ElectronWebContentsViewFunctions.getStats(browserViewId)
  const restoredTabs =
    savedTabs.length > 0 ? savedTabs : [createTab({ browserViewId: 0, iframeSrc, inputValue: iframeSrc, title: title || 'Simple Browser' })]
  const selectedTabIndex = tabsEnabled ? savedSelectedTabIndex : 0
  const tabsToRestore = tabsEnabled ? restoredTabs : [restoredTabs[savedSelectedTabIndex]]
  const savedActiveTab = tabsToRestore[selectedTabIndex]
  const activeTab = createTab({
    ...savedActiveTab,
    browserViewId,
    canGoBack,
    canGoForward,
    iframeSrc,
    inputValue: savedActiveTab.inputValue,
    muted: Boolean(isAudioMuted),
    title: title || savedActiveTab.title || 'Simple Browser',
  })
  const tabs = tabsToRestore.with(selectedTabIndex, activeTab)
  return {
    ...state,
    audioIndicatorEnabled,
    iframeSrc: activeTab.iframeSrc,
    inputValue: activeTab.inputValue,
    title: activeTab.title,
    browserViewId,
    canGoBack,
    canGoForward,
    muted: Boolean(isAudioMuted),
    uri: id ? uri : `simple-browser://${browserViewId}`,
    headerHeight,
    selectedTabIndex,
    suggestionsEnabled,
    shortcuts,
    tabs,
    tabsEnabled,
    tabHoverEnabled,
    unloadTabs,
    visitedSites,
  }
}

export const show = async (state) => {
  const { browserViewId } = state
  visibleBrowserUids.add(state.uid)
  const selectedTab = state.tabs[state.selectedTabIndex]
  if (browserViewId && !selectedTab?.pageSnapshot) {
    await ElectronWebContentsViewFunctions.show(browserViewId)
  }
}

export const hide = async (state) => {
  visibleBrowserUids.delete(state.uid)
  await Promise.all(state.tabs.filter((tab) => tab.browserViewId).map((tab) => ElectronWebContentsViewFunctions.hide(tab.browserViewId)))
}

const createUnloadedTab = async (state) => {
  const { headerHeight, height, uid, width, x, y } = state
  const browserViewId = await ElectronWebContentsView.createWebContentsView(0, uid)
  await ElectronWebContentsViewFunctions.hide(browserViewId)
  await ElectronWebContentsViewFunctions.resizeWebContentsView(browserViewId, x, y + headerHeight, width, height - headerHeight)
  return createTab({ browserViewId })
}

const createEmptyTab = async (state) => {
  const tab = await createUnloadedTab(state)
  await ElectronWebContentsViewFunctions.setIframeSrc(tab.browserViewId, SimpleBrowserNewTabPage.getUrl())
  return tab
}

export const handleColorThemeChanged = async (state) => {
  const { tabs } = state
  const newTabUrl = SimpleBrowserNewTabPage.getUrl()
  await Promise.all(
    tabs.filter((tab) => !tab.iframeSrc && tab.browserViewId).map((tab) => ElectronWebContentsViewFunctions.setIframeSrc(tab.browserViewId, newTabUrl)),
  )
  return state
}

const materializeTab = async (state, tab) => {
  const createdTab = tab.iframeSrc ? await createUnloadedTab(state) : await createEmptyTab(state)
  if (tab.iframeSrc) {
    void ElectronWebContentsViewFunctions.setIframeSrc(createdTab.browserViewId, tab.iframeSrc)
  }
  return {
    ...tab,
    browserViewId: createdTab.browserViewId,
    isLoading: Boolean(tab.iframeSrc),
  }
}

const prepareTabDeactivation = async (state, tab) => {
  if (!tab || !state.unloadTabs || !tab.browserViewId || tab.isAudioPlaying || tab.muted) {
    return { shouldUnload: false }
  }
  if (tab.pageSnapshot) {
    return { pageSnapshot: tab.pageSnapshot, shouldUnload: true }
  }
  try {
    const pageSnapshot = await SimpleBrowserPageSnapshot.capture(tab.browserViewId)
    return { pageSnapshot, shouldUnload: true }
  } catch (error) {
    console.error('[renderer-worker] Failed to capture Simple Browser tab snapshot', error)
    return { shouldUnload: false }
  }
}

const switchToTab = async (state, initialTabs, selectedTabIndex) => {
  const oldTabIndex = initialTabs.findIndex((tab) => tab.browserViewId === state.browserViewId)
  const oldTab = initialTabs[oldTabIndex]
  const oldBrowserViewId = oldTab?.browserViewId || state.browserViewId
  const deactivationPromise = prepareTabDeactivation(state, oldTab)
  let tabs = initialTabs
  let selectedTab = tabs[selectedTabIndex]
  if (!selectedTab.browserViewId) {
    selectedTab = await materializeTab(state, selectedTab)
    tabs = tabs.with(selectedTabIndex, selectedTab)
  }
  if (!selectedTab.pageSnapshot) {
    await ElectronWebContentsViewFunctions.show(selectedTab.browserViewId)
  }
  const deactivation = await deactivationPromise
  if (oldBrowserViewId) {
    if (deactivation.shouldUnload && oldTab) {
      await ElectronWebContentsView.disposeWebContentsView(oldBrowserViewId)
      tabs = tabs.with(oldTabIndex, {
        ...oldTab,
        browserViewId: 0,
        isLoading: false,
        pageSnapshot: deactivation.pageSnapshot,
      })
    } else {
      await ElectronWebContentsViewFunctions.hide(oldBrowserViewId)
    }
  }
  if (!selectedTab.pageSnapshot) {
    await ElectronWebContentsViewFunctions.focus(selectedTab.browserViewId)
  }
  return activateTab(state, tabs, selectedTabIndex)
}

export const createNewTab = async (state) => {
  if (!state.tabsEnabled) {
    return state
  }
  const currentState = state.hasSuggestionsOverlay ? await closeSuggestions(state) : state
  const tab = await createEmptyTab(currentState)
  const newState = await switchToTab(currentState, [...currentState.tabs, tab], currentState.tabs.length)
  await ElectronWindow.focus()
  return { ...newState, focusAddressVersion: newState.focusAddressVersion + 1 }
}

export const duplicateTab = async (state, index) => {
  const { hasSuggestionsOverlay, tabs: oldTabs, tabsEnabled } = state
  if (!tabsEnabled) {
    return state
  }
  const tabIndex = Number(index)
  if (tabIndex < 0 || tabIndex >= oldTabs.length) {
    return state
  }
  const currentState = hasSuggestionsOverlay ? await closeSuggestions(state) : state
  const sourceTab = currentState.tabs[tabIndex]
  const emptyTab = sourceTab.iframeSrc ? await createUnloadedTab(currentState) : await createEmptyTab(currentState)
  const tab = {
    ...emptyTab,
    iframeSrc: sourceTab.iframeSrc,
    inputValue: sourceTab.inputValue,
    isLoading: Boolean(sourceTab.iframeSrc),
    title: sourceTab.title,
  }
  if (tab.iframeSrc) {
    void ElectronWebContentsViewFunctions.setIframeSrc(tab.browserViewId, tab.iframeSrc)
  }
  const tabs = currentState.tabs.toSpliced(tabIndex + 1, 0, tab)
  const newState = await switchToTab(currentState, tabs, tabIndex + 1)
  return tab.iframeSrc ? newState : { ...newState, focusAddressVersion: newState.focusAddressVersion + 1 }
}

export const muteTab = async (state, index) => {
  const { tabs } = state
  const tabIndex = Number(index)
  if (tabIndex < 0 || tabIndex >= tabs.length) {
    return state
  }
  const tab = tabs[tabIndex]
  const muted = !tab.muted
  await ElectronWebContentsViewFunctions.setAudioMuted(tab.browserViewId, muted)
  return updateTab(state, tab.browserViewId, { muted })
}

export const reloadTab = async (state, index) => {
  const { tabs } = state
  const tabIndex = Number(index)
  if (tabIndex < 0 || tabIndex >= tabs.length) {
    return state
  }
  const tab = tabs[tabIndex]
  await ElectronWebContentsViewFunctions.reload(tab.browserViewId)
  return updateTab(state, tab.browserViewId, { isLoading: true })
}

export const openTab = async (state, url, disposition) => {
  const { hasSuggestionsOverlay } = state
  const currentState = hasSuggestionsOverlay ? await closeSuggestions(state) : state
  if (disposition === 'background-tab' && currentState.unloadTabs) {
    const tab = createTab({ browserViewId: 0, iframeSrc: url, inputValue: url })
    return { ...currentState, tabs: [...currentState.tabs, tab] }
  }
  const emptyTab = await createUnloadedTab(currentState)
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
  return switchToTab(currentState, tabs, currentState.tabs.length)
}

export const handleWindowOpen = async (state, browserViewId, url, disposition) => {
  const { tabs: oldTabs, tabsEnabled } = state
  const ownsWebContentsView = oldTabs.some((tab) => tab.browserViewId === Number(browserViewId))
  const openExternalLinks = Preferences.get('simpleBrowser.openExternalLinks') === 'externalBrowser'
  if (!ownsWebContentsView) {
    return state
  }
  if (openExternalLinks || !tabsEnabled) {
    await Command.execute('Open.openExternal', url)
    return state
  }
  return openTab(state, url, disposition)
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
  return switchToTab(newState, newState.tabs, selectedTabIndex)
}

export const focusNextTab = (state) => {
  if (state.tabs.length === 0) {
    return state
  }
  return selectTab(state, (state.selectedTabIndex + 1) % state.tabs.length)
}

export const focusPreviousTab = (state) => {
  if (state.tabs.length === 0) {
    return state
  }
  return selectTab(state, (state.selectedTabIndex - 1 + state.tabs.length) % state.tabs.length)
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
  let tabs = currentState.tabs.toSpliced(tabIndex, 1)
  const wasSelected = tabIndex === currentState.selectedTabIndex
  let selectedTabIndex = currentState.selectedTabIndex
  if (wasSelected) {
    selectedTabIndex = Math.min(tabIndex, tabs.length - 1)
  } else if (tabIndex < selectedTabIndex) {
    selectedTabIndex--
  }
  if (tab.browserViewId) {
    await ElectronWebContentsView.disposeWebContentsView(tab.browserViewId)
  }
  if (!wasSelected) {
    return { ...currentState, selectedTabIndex, tabs }
  }
  let selectedTab = tabs[selectedTabIndex]
  if (!selectedTab.browserViewId) {
    selectedTab = await materializeTab(currentState, selectedTab)
    tabs = tabs.with(selectedTabIndex, selectedTab)
  }
  if (!selectedTab.pageSnapshot) {
    await ElectronWebContentsViewFunctions.show(selectedTab.browserViewId)
    await ElectronWebContentsViewFunctions.focus(selectedTab.browserViewId)
  }
  return activateTab(currentState, tabs, selectedTabIndex)
}

export const closeCurrentTab = (state) => {
  return closeTab(state, state.selectedTabIndex)
}

const closeTabsByIndex = async (state, indexes, preferredTabIndex) => {
  const { hasSuggestionsOverlay, selectedTabIndex: oldSelectedTabIndex, tabsEnabled } = state
  if (!tabsEnabled || indexes.length === 0) {
    return state
  }
  const indexesToClose = new Set(indexes)
  const selectedTabWillClose = indexesToClose.has(oldSelectedTabIndex)
  const currentState = selectedTabWillClose && hasSuggestionsOverlay ? await closeSuggestions(state) : state
  const { browserViewId, tabs: currentTabs } = currentState
  const preferredBrowserViewId = currentTabs[preferredTabIndex]?.browserViewId
  const tabsToClose = currentTabs.filter((tab, index) => indexesToClose.has(index))
  let remainingTabs = currentTabs.filter((tab, index) => !indexesToClose.has(index))
  await Promise.all(tabsToClose.filter((tab) => tab.browserViewId).map((tab) => ElectronWebContentsView.disposeWebContentsView(tab.browserViewId)))
  const retainedSelectedTabIndex = remainingTabs.findIndex((tab) => tab.browserViewId === browserViewId)
  if (retainedSelectedTabIndex !== -1) {
    return {
      ...currentState,
      selectedTabIndex: retainedSelectedTabIndex,
      tabs: remainingTabs,
    }
  }
  const selectedTabIndex = Math.max(
    0,
    remainingTabs.findIndex((tab) => tab.browserViewId === preferredBrowserViewId),
  )
  let selectedTab = remainingTabs[selectedTabIndex]
  if (!selectedTab.browserViewId) {
    selectedTab = await materializeTab(currentState, selectedTab)
    remainingTabs = remainingTabs.with(selectedTabIndex, selectedTab)
  }
  if (!selectedTab.pageSnapshot) {
    await ElectronWebContentsViewFunctions.show(selectedTab.browserViewId)
    await ElectronWebContentsViewFunctions.focus(selectedTab.browserViewId)
  }
  return activateTab(currentState, remainingTabs, selectedTabIndex)
}

export const closeTabsToTheLeft = async (state, index) => {
  const { tabs } = state
  const tabIndex = Number(index)
  if (tabIndex <= 0 || tabIndex >= tabs.length) {
    return state
  }
  const indexes = Array.from({ length: tabIndex }, (_, index) => index)
  return closeTabsByIndex(state, indexes, tabIndex)
}

export const closeTabsToTheRight = async (state, index) => {
  const { tabs } = state
  const tabIndex = Number(index)
  if (tabIndex < 0 || tabIndex >= tabs.length - 1) {
    return state
  }
  const indexes = Array.from({ length: tabs.length - tabIndex - 1 }, (_, index) => tabIndex + index + 1)
  return closeTabsByIndex(state, indexes, tabIndex)
}

export const closeOtherTabs = async (state, index) => {
  const { tabs } = state
  const tabIndex = Number(index)
  if (tabIndex < 0 || tabIndex >= tabs.length || tabs.length === 1) {
    return state
  }
  const indexes = tabs.map((_, index) => index).filter((index) => index !== tabIndex)
  return closeTabsByIndex(state, indexes, tabIndex)
}

export const showOverlay = async (state, overlayId) => {
  if (state.overlayIds.includes(overlayId)) {
    return state
  }
  const overlayIds = [...state.overlayIds, overlayId]
  const selectedTab = state.tabs[state.selectedTabIndex]
  if (state.snapshot || selectedTab?.pageSnapshot) {
    return {
      ...state,
      overlayIds,
    }
  }
  let snapshot = ''
  try {
    if (state.iframeSrc) {
      const bytes = await ElectronWebContentsViewFunctions.capturePage(state.browserViewId)
      snapshot = SimpleBrowserSnapshot.create(bytes)
    }
    return {
      ...state,
      overlayIds,
      snapshot,
    }
  } catch (error) {
    SimpleBrowserSnapshot.dispose(snapshot)
    console.error('[renderer-worker] Failed to capture Simple Browser page', error)
    return state
  }
}

export const afterRender = async (oldState, newState) => {
  const { overlayIds: oldOverlayIds } = oldState
  const { browserViewId, overlayIds, selectedTabIndex, tabs } = newState
  const didShowFirstOverlay = oldOverlayIds.length === 0 && overlayIds.length > 0
  const selectedTab = tabs[selectedTabIndex]
  if (!didShowFirstOverlay || selectedTab?.pageSnapshot) {
    return
  }
  try {
    await ElectronWebContentsViewFunctions.hide(browserViewId)
  } catch (error) {
    console.error('[renderer-worker] Failed to hide Simple Browser page', error)
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
    await show(state)
  } catch (error) {
    console.error('[renderer-worker] Failed to restore Simple Browser page', error)
  } finally {
    SimpleBrowserSnapshot.dispose(state.snapshot)
  }
  return {
    ...state,
    overlayIds,
    snapshot: '',
  }
}

const tabHoverOverlayId = 'tab-hover'
const tabHoverWidth = 320

export const showTabHover = async (state, index, tabOffsetLeft, tabWidth, tabsScrollLeft) => {
  const { tabHover, tabHoverEnabled, tabs, width } = state
  if (!tabHoverEnabled) {
    return state
  }
  const tabIndex = Number(index)
  const tab = tabs[tabIndex]
  if (!tab || tabHover?.index === tabIndex) {
    return state
  }
  const overlayState = await showOverlay(state, tabHoverOverlayId)
  if (!overlayState.overlayIds.includes(tabHoverOverlayId)) {
    return state
  }
  let statusLabel = tab.browserViewId ? 'Memory usage unavailable' : 'Tab is unloaded'
  let title = tab.title || 'New Tab'
  if (tab.browserViewId) {
    try {
      const stats = await ElectronWebContentsViewFunctions.getStats(tab.browserViewId, true)
      title = stats.title || title
      if (Number.isFinite(stats.memory)) {
        statusLabel = `Memory usage: ${PrettyBytes.formatBytes(stats.memory)}`
      }
    } catch (error) {
      console.error('[renderer-worker] Failed to get Simple Browser tab memory usage', error)
    }
  }
  const tabLeft = Number(tabOffsetLeft) - Number(tabsScrollLeft)
  const maximumLeft = Math.max(8, width - tabHoverWidth - 8)
  const left = Math.max(8, Math.min(tabLeft, maximumLeft))
  return {
    ...overlayState,
    tabHover: {
      index: tabIndex,
      left,
      statusLabel,
      tabLeft: Number(tabLeft),
      tabWidth: Number(tabWidth),
      title,
    },
  }
}

export const hideTabHover = async (state, index, clientX, clientY) => {
  const { tabHover, x, y } = state
  if (!tabHover) {
    return state
  }
  const tabIndex = Number(index)
  if (Number.isFinite(tabIndex) && tabIndex !== tabHover.index) {
    return state
  }
  const pointerInsideTab =
    Number.isFinite(clientX) &&
    Number.isFinite(clientY) &&
    clientX >= x + tabHover.tabLeft &&
    clientX < x + tabHover.tabLeft + tabHover.tabWidth &&
    clientY >= y &&
    clientY < y + tabsHeaderHeight
  if (pointerInsideTab) {
    return state
  }
  return hideOverlay({ ...state, tabHover: undefined }, tabHoverOverlayId)
}

export const handleInput = async (state, value) => {
  const newState = {
    ...updateTab(state, state.browserViewId, { inputValue: value }),
    selectedSuggestionIndex: -1,
  }
  if (!state.suggestionsEnabled || value.trim().length < 2) {
    if (state.hasSuggestionsOverlay) {
      void Command.execute('SimpleBrowser.closeSuggestions')
    }
    return newState
  }
  if (!shouldRequestSuggestions(value)) {
    return applySuggestions(newState, state.uid, value, [])
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
  return !/^(?:[a-z][a-z\d+.-]*:\/\/|localhost(?::\d+)?(?:\/|$)|\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:\/|$)|(?:[\w-]+\.)+[a-z]{2,}(?::\d+)?(?:\/|$))/i.test(
    query,
  )
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

const createSearchSuggestion = (value) => {
  return { favicon: '', type: 'search', value }
}

const getSuggestionValue = (suggestion) => {
  return typeof suggestion === 'string' ? suggestion : suggestion?.value
}

export const applySuggestions = async (state, uid, query, suggestions) => {
  if (state.uid !== uid || state.inputValue !== query || !state.suggestionsEnabled) {
    return state
  }
  const visitedSiteSuggestions = BrowserVisitedSites.getSuggestions(state.visitedSites, query)
  const providerSuggestions = Array.isArray(suggestions) ? suggestions : []
  const allSuggestions = [
    ...visitedSiteSuggestions,
    ...(providerSuggestions.length > 0 ? [createSearchSuggestion(query)] : []),
    ...providerSuggestions.map(createSearchSuggestion),
  ]
  const uniqueSuggestions = allSuggestions
    .filter((suggestion, index) => allSuggestions.findIndex((other) => other.value === suggestion.value) === index)
    .slice(0, 8)
  if (uniqueSuggestions.length === 0) {
    return closeSuggestions(state)
  }
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

const openCookieImportView = (value) => {
  if (!value.startsWith('cookie-import-view:///')) {
    return false
  }
  void Command.execute('Main.openUri', value)
  return true
}

const navigate = (state, value) => {
  if (openCookieImportView(value)) {
    return state
  }
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
  const suggestion = typeof value === 'string' ? value : getSuggestionValue(state.suggestions[state.selectedSuggestionIndex])
  if (typeof suggestion !== 'string') {
    return state
  }
  const newState = await closeSuggestions(state)
  return navigate(newState, suggestion)
}

export const setUrl = async (state, value) => {
  const newState1 = await handleInput(state, value)
  const { inputValue, browserViewId, shortcuts } = newState1
  if (openCookieImportView(inputValue)) {
    return newState1
  }
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
  const newState = state.hasSuggestionsOverlay ? await closeSuggestions(state) : state
  return navigate(newState, newState.inputValue)
}

export const handleWillNavigate = (state, browserViewId, value) => {
  const [actualBrowserViewId, url] = parseWebContentsEvent(state, browserViewId, value)
  return updateTab(state, actualBrowserViewId, {
    favicon: '',
    iframeSrc: SimpleBrowserNewTabPage.toDisplayUrl(url),
    isAudioPlaying: false,
    isLoading: true,
  })
}

export const handleFocusIn = (state, name) => {
  const focusKey = name === InputName.SimpleBrowserAddress ? WhenExpression.FocusSimpleBrowserInput : WhenExpression.FocusSimpleBrowser
  Focus.setFocus(focusKey, undefined, state.uid, ViewletModuleId.SimpleBrowser)
  return state
}

export const handleKeyBinding = async (state, browserViewId, keyBinding) => {
  if (Number(browserViewId) !== state.browserViewId) {
    return state
  }
  if (keyBinding === closeTabKeyBinding) {
    return closeCurrentTab(state)
  }
  if (keyBinding === createNewTabKeyBinding) {
    return createNewTab(state)
  }
  if (keyBinding === focusNextTabKeyBinding) {
    return focusNextTab(state)
  }
  if (keyBinding === focusPreviousTabKeyBinding) {
    return focusPreviousTab(state)
  }
  if (keyBinding === openHistoryKeyBinding) {
    await Command.execute('Main.openUri', 'simple-browser-history://')
    return state
  }
  await KeyBindings.handleKeyBinding(keyBinding)
  return state
}

export const handleDidNavigate = async (state, browserViewId, value) => {
  const [actualBrowserViewId, url] = parseWebContentsEvent(state, browserViewId, value)
  const displayUrl = SimpleBrowserNewTabPage.toDisplayUrl(url)
  const { canGoBack, canGoForward } = await ElectronWebContentsViewFunctions.getStats(actualBrowserViewId)
  const tab = state.tabs.find((tab) => tab.browserViewId === actualBrowserViewId)
  if (tab?.pageSnapshot && actualBrowserViewId === state.browserViewId && visibleBrowserUids.has(state.uid)) {
    await ElectronWebContentsViewFunctions.show(actualBrowserViewId)
    await ElectronWebContentsViewFunctions.focus(actualBrowserViewId)
  }
  const newState = updateTab(state, actualBrowserViewId, {
    canGoBack,
    canGoForward,
    iframeSrc: displayUrl,
    inputValue: displayUrl,
    isLoading: false,
    pageSnapshot: undefined,
  })
  await BrowserHistory.record(url)
  return newState
}

export const handleDidNavigationCancel = async (state, browserViewId) => {
  const [actualBrowserViewId] = parseWebContentsEvent(state, browserViewId)
  const tab = state.tabs.find((tab) => tab.browserViewId === actualBrowserViewId)
  if (tab?.pageSnapshot && actualBrowserViewId === state.browserViewId && visibleBrowserUids.has(state.uid)) {
    await ElectronWebContentsViewFunctions.show(actualBrowserViewId)
  }
  return updateTab(state, actualBrowserViewId, {
    isLoading: false,
    pageSnapshot: undefined,
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
  const tab = state.tabs.find((tab) => tab.browserViewId === actualBrowserViewId)
  const newState = updateTab(state, actualBrowserViewId, { favicon })
  if (!tab) {
    return newState
  }
  const visitedSites = BrowserVisitedSites.add(state.visitedSites, tab.iframeSrc, favicon)
  if (visitedSites === state.visitedSites) {
    return newState
  }
  void BrowserVisitedSites.save(visitedSites)
  return {
    ...newState,
    visitedSites,
  }
}

export const handleAudioStateChanged = (state, browserViewId, audible) => {
  const [actualBrowserViewId, isAudioPlaying] = parseWebContentsEvent(state, browserViewId, audible)
  return updateTab(state, actualBrowserViewId, { isAudioPlaying: Boolean(isAudioPlaying) })
}

export const dispose = async (state) => {
  visibleBrowserUids.delete(state.uid)
  await Promise.all([
    ...state.tabs.filter((tab) => tab.browserViewId).map((tab) => ElectronWebContentsView.disposeWebContentsView(tab.browserViewId)),
    RendererProcess.invoke('Viewlet.sendMultiple', [['Css.removeCssStyleSheet', SimpleBrowserPageSnapshot.getStyleSheetId(state.uid)]]),
    SimpleBrowserSnapshot.dispose(state.snapshot),
  ])
}
