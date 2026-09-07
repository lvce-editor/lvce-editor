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
  )
}

const renderDom = {
  isEqual(oldState, newState) {
    return (
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

export const render = [renderDom, renderAddressValue, renderFocusAddress, renderPageSnapshotCss, TabDrag.renderDragData]
