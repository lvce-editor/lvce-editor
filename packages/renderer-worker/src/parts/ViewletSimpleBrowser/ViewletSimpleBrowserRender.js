import { diffTree } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetSimpleBrowserVirtualDom from '../GetSimpleBrowserVirtualDom/GetSimpleBrowserVirtualDom.js'
import * as InputName from '../InputName/InputName.js'
import * as SimpleBrowserPageSnapshot from '../SimpleBrowserPageSnapshot/SimpleBrowserPageSnapshot.js'
import * as TabDrag from './ViewletSimpleBrowserTabDrag.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const renderEventListeners = () => {
  return [
    { name: 'handleSimpleBrowserFindInput', params: ['handleFindInput', 'event.target.value'] },
    { name: 'handleSimpleBrowserFindCase', params: ['toggleFindMatchCase'] },
    { name: 'handleSimpleBrowserFindNext', params: ['findNext'] },
    { name: 'handleSimpleBrowserFindPrevious', params: ['findPrevious'] },
    { name: 'handleSimpleBrowserFindClose', params: ['closeFind'] },
    { name: DomEventListenerFunctions.HandleSubmitSimpleBrowserAddress, params: ['go'], preventDefault: true },
    {
      name: 'handle-simple-browser-login-submit',
      params: [
        'submitLogin',
        'event.currentTarget.dataset.requestId',
        'event.currentTarget.elements.username.value',
        'event.currentTarget.elements.password.value',
      ],
      preventDefault: true,
    },
    { name: 'handle-simple-browser-login-keydown', params: ['cancelLoginOnEscape', 'event.currentTarget.dataset.requestId', 'event.key'] },
    { name: 'handle-simple-browser-login-cancel', params: ['cancelLogin', 'event.currentTarget.dataset.requestId'] },
    { name: DomEventListenerFunctions.HandleBlurSimpleBrowserAddress, params: ['handleAddressBlur'] },
    { name: DomEventListenerFunctions.HandlePointerDownSimpleBrowserSuggestion, params: ['handleSuggestionPointerDown'], preventDefault: true },
    { name: DomEventListenerFunctions.HandleClickSuggestion, params: ['acceptSuggestion', 'event.currentTarget.dataset.value'] },
    {
      name: DomEventListenerFunctions.HandleErrorSimpleBrowserFavicon,
      params: ['handleFaviconError', 'event.target.dataset.index', 'event.target.src'],
    },
    { name: DomEventListenerFunctions.HandleClickSimpleBrowserFullWidth, params: ['toggleFullWidth'] },
    {
      name: DomEventListenerFunctions.HandleClickBackward,
      params: ['backward'],
    },
    {
      name: DomEventListenerFunctions.HandleClickForward,
      params: ['forward'],
    },
    {
      name: DomEventListenerFunctions.HandleClickReload,
      params: ['reload'],
    },
    {
      name: DomEventListenerFunctions.HandleInput,
      params: ['handleInput', 'event.target.value'],
    },
    {
      name: DomEventListenerFunctions.HandleInputSimpleBrowserHistory,
      params: ['handleHistoryInput', 'event.target.value'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserHistoryClear,
      params: ['clearHistory'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserHistoryRemove,
      params: ['removeHistoryEntry', 'event.currentTarget.dataset.index'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserHistoryUrl,
      params: ['setUrl', 'event.currentTarget.dataset.url'],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandleFocusInSimpleBrowser,
      params: ['handleFocusIn', 'event.target.name'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserTabClose,
      params: ['closeTab', 'event.currentTarget.dataset.index'],
      stopPropagation: true,
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserTabAudio,
      params: ['muteTab', 'event.currentTarget.dataset.index'],
      stopPropagation: true,
    },
    {
      name: DomEventListenerFunctions.HandleContextMenuSimpleBrowserTab,
      params: ['handleTabContextMenu', 'event.currentTarget.dataset.index', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenerFunctions.HandlePointerOverSimpleBrowserTab,
      params: [
        'showTabHover',
        'event.currentTarget.dataset.index',
        'event.currentTarget.offsetLeft',
        'event.currentTarget.offsetWidth',
        'event.currentTarget.parentElement.scrollLeft',
      ],
    },
    {
      name: DomEventListenerFunctions.HandlePointerOutSimpleBrowserTab,
      params: ['hideTabHover', 'event.currentTarget.dataset.index', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenerFunctions.HandlePointerDownSimpleBrowserTab,
      params: ['handleTabPointerDown', 'event.currentTarget.dataset.index', 'event.button'],
    },
    {
      name: DomEventListenerFunctions.HandleDragStartSimpleBrowserTab,
      params: ['handleTabDragStart'],
      stopPropagation: true,
    },
    {
      name: DomEventListenerFunctions.HandleDragEndSimpleBrowserTab,
      params: ['resetTabDrag'],
    },
    {
      name: DomEventListenerFunctions.HandlePointerUpSimpleBrowserTab,
      params: ['resetTabDrag'],
    },
    {
      name: DomEventListenerFunctions.HandleDragOverSimpleBrowserTab,
      params: [
        'handleTabDragOver',
        'event.currentTarget.dataset.index',
        'event.currentTarget.offsetLeft',
        'event.currentTarget.offsetWidth',
        'event.currentTarget.parentElement.scrollLeft',
        'event.clientX',
      ],
      preventDefault: true,
      stopPropagation: true,
    },
    {
      name: DomEventListenerFunctions.HandleDragOverSimpleBrowserTabs,
      params: ['handleTabsDragOver'],
      preventDefault: true,
      stopPropagation: true,
    },
    {
      name: DomEventListenerFunctions.HandleDragLeaveSimpleBrowserTab,
      params: ['handleTabDragLeave', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenerFunctions.HandleDropSimpleBrowserTab,
      params: ['handleTabDrop'],
      preventDefault: true,
      stopPropagation: true,
    },
    {
      name: DomEventListenerFunctions.HandlePointerDownSimpleBrowserTabAction,
      params: ['hideTabHover'],
      stopPropagation: true,
    },
    {
      name: DomEventListenerFunctions.HandlePointerOutSimpleBrowserTabs,
      params: ['handleTabsPointerOut', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenerFunctions.HandlePointerOverSimpleBrowserTabs,
      params: ['handleTabsPointerOver', 'event.currentTarget.firstElementChild.firstElementChild.offsetWidth'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserNewTab,
      params: ['createNewTab'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserMenu,
      params: [
        'showMenu',
        'event.clientX',
        'event.currentTarget.parentElement.offsetTop',
        'event.currentTarget.offsetTop',
        'event.currentTarget.offsetHeight',
      ],
    },
  ]
}

const areTabsEqual = (oldTabs, newTabs) => {
  if (oldTabs === newTabs) {
    return true
  }
  if (oldTabs.length !== newTabs.length) {
    return false
  }
  return oldTabs.every((oldTab, index) => {
    const newTab = newTabs[index]
    return (
      oldTab.browserViewId === newTab.browserViewId &&
      oldTab.previewUid === newTab.previewUid &&
      oldTab.favicon === newTab.favicon &&
      oldTab.isAudioPlaying === newTab.isAudioPlaying &&
      oldTab.muted === newTab.muted &&
      oldTab.pageSnapshot === newTab.pageSnapshot &&
      oldTab.title === newTab.title
    )
  })
}

const getDom = (state) => {
  const pageSnapshot = state.tabs?.[state.selectedTabIndex]?.pageSnapshot
  const historyTab = state.tabs?.[state.selectedTabIndex]?.iframeSrc?.startsWith('simple-browser-history://')
  return GetSimpleBrowserVirtualDom.getSimpleBrowserVirtualDom(
    state.canGoBack,
    state.canGoForward,
    state.isLoading,
    state.inputValue,
    state.snapshot,
    state.suggestions,
    state.selectedSuggestionIndex,
    state.tabs,
    state.selectedTabIndex,
    state.tabsEnabled,
    state.audioIndicatorEnabled,
    pageSnapshot?.dom,
    state.tabHover,
    state.tabDropIndex,
    state.fullWidth,
    state.chromeTheme,
    state,
    historyTab,
    state.history,
    state.historySearchValue,
    state.loginChallenges?.[0],
  )
}

export const getComponentDom = (state) => {
  const dom = getDom(state)
  return dom.map((node) => (node.name === InputName.SimpleBrowserAddress ? { ...node, value: state.inputValue } : node))
}

const renderDom = {
  isEqual(oldState, newState) {
    return (
      oldState.findVisible === newState.findVisible &&
      oldState.findValue === newState.findValue &&
      oldState.findMatchCase === newState.findMatchCase &&
      oldState.findMatches === newState.findMatches &&
      oldState.findActiveMatch === newState.findActiveMatch &&
      oldState.fullWidth === newState.fullWidth &&
      oldState.chromeTheme === newState.chromeTheme &&
      oldState.iframeSrc === newState.iframeSrc &&
      oldState.canGoBack === newState.canGoBack &&
      oldState.canGoForward === newState.canGoForward &&
      oldState.isLoading === newState.isLoading &&
      oldState.snapshot === newState.snapshot &&
      oldState.suggestions === newState.suggestions &&
      (oldState.inputValue === newState.inputValue || newState.suggestions.length === 0) &&
      oldState.selectedSuggestionIndex === newState.selectedSuggestionIndex &&
      oldState.selectedTabIndex === newState.selectedTabIndex &&
      oldState.tabsEnabled === newState.tabsEnabled &&
      oldState.audioIndicatorEnabled === newState.audioIndicatorEnabled &&
      oldState.tabHover === newState.tabHover &&
      oldState.loginChallenges === newState.loginChallenges &&
      oldState.tabWidth === newState.tabWidth &&
      oldState.history === newState.history &&
      oldState.historySearchValue === newState.historySearchValue &&
      oldState.tabDropIndex === newState.tabDropIndex &&
      areTabsEqual(oldState.tabs, newState.tabs)
    )
  },
  apply(oldState, newState) {
    const newDom = getDom(newState)
    if (oldState.browserViewId === 0) {
      return [['Viewlet.setDom2', newState.uid, newDom]]
    }
    const patches = diffTree(getDom(oldState), newDom)
    return [['Viewlet.setTreePatches', newState.uid, patches]]
  },
  multiple: true,
}

export const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.title === newState.title
  },
  apply(oldState, newState) {
    return newState.title
  },
}

const renderAddressValue = {
  isEqual(oldState, newState) {
    return (
      oldState.browserViewId === newState.browserViewId &&
      oldState.iframeSrc === newState.iframeSrc &&
      oldState.addressValueVersion === newState.addressValueVersion
    )
  },
  apply(oldState, newState) {
    return [['Viewlet.setValueByName', newState.uid, InputName.SimpleBrowserAddress, newState.inputValue]]
  },
  multiple: true,
}

const renderFocusAddress = {
  isEqual(oldState, newState) {
    return oldState.focusAddressVersion === newState.focusAddressVersion
  },
  apply(oldState, newState) {
    return [['Viewlet.focusElementByName', newState.uid, InputName.SimpleBrowserAddress]]
  },
  multiple: true,
}

const getSelectedPageSnapshot = (state) => {
  return state.tabs?.[state.selectedTabIndex]?.pageSnapshot
}

const renderPageSnapshotCss = {
  isEqual(oldState, newState) {
    const oldSnapshot = getSelectedPageSnapshot(oldState)
    const newSnapshot = getSelectedPageSnapshot(newState)
    return oldSnapshot?.css === newSnapshot?.css
  },
  apply(oldState, newState) {
    const styleSheetId = SimpleBrowserPageSnapshot.getStyleSheetId(newState.uid)
    const pageSnapshot = getSelectedPageSnapshot(newState)
    if (!pageSnapshot) {
      return [['Css.removeCssStyleSheet', styleSheetId]]
    }
    return [['Css.addCssStyleSheet', styleSheetId, SimpleBrowserPageSnapshot.getScopedCss(pageSnapshot.css)]]
  },
  multiple: true,
}

const renderFindFocus = {
  isEqual(oldState, newState) {
    return oldState.findFocusVersion === newState.findFocusVersion
  },
  apply(oldState, newState) {
    return [
      ['Viewlet.focusElementByName', newState.uid, 'simple-browser-find'],
      ['Viewlet.setSelectionByName', newState.uid, 'simple-browser-find', 0, newState.findValue.length],
    ]
  },
  multiple: true,
}

export const render = [renderDom, renderAddressValue, renderFocusAddress, renderPageSnapshotCss, TabDrag.renderDragData, renderFindFocus]
