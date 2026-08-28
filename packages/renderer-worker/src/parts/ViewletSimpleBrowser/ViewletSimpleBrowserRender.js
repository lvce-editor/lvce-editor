import { diffTree } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetSimpleBrowserVirtualDom from '../GetSimpleBrowserVirtualDom/GetSimpleBrowserVirtualDom.js'
import * as InputName from '../InputName/InputName.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const renderEventListeners = () => {
  return [
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserTab,
      params: ['selectTab', 'event.currentTarget.dataset.index'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserTabClose,
      params: ['closeTab', 'event.currentTarget.dataset.index'],
      stopPropagation: true,
    },
    {
      name: DomEventListenerFunctions.HandleContextMenuSimpleBrowserTab,
      params: ['handleTabContextMenu', 'event.currentTarget.dataset.index', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserNewTab,
      params: ['createNewTab'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserMenu,
      params: ['showMenu', 'event.clientX', 'event.clientY'],
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
      oldTab.title === newTab.title
    )
  })
}

const getDom = (state) => {
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
  )
}

const renderDom = {
  isEqual(oldState, newState) {
    return (
      oldState.iframeSrc === newState.iframeSrc &&
      oldState.canGoBack === newState.canGoBack &&
      oldState.canGoForward === newState.canGoForward &&
      oldState.isLoading === newState.isLoading &&
      oldState.snapshot === newState.snapshot &&
      oldState.suggestions === newState.suggestions &&
      oldState.selectedSuggestionIndex === newState.selectedSuggestionIndex &&
      oldState.selectedTabIndex === newState.selectedTabIndex &&
      oldState.tabsEnabled === newState.tabsEnabled &&
      areTabsEqual(oldState.tabs, newState.tabs)
    )
  },
  apply(oldState, newState) {
    const newDom = getDom(newState)
    const commands =
      oldState.browserViewId === 0
        ? [['Viewlet.setDom2', newState.uid, newDom]]
        : [['Viewlet.setPatches', newState.uid, diffTree(getDom(oldState), newDom)]]
    if (newState.suggestions.length > 0) {
      commands.push(['Viewlet.focusElementByName', newState.uid, InputName.SimpleBrowserAddress])
    }
    return commands
  },
  multiple: true,
}

// TODO this component shouldn't depend on Main
const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.title === newState.title
  },
  apply(oldState, newState) {
    return ['Viewlet.send', ViewletModuleId.Main, 'updateTab', 0, newState.title]
  },
}

const renderFocusAddress = {
  isEqual(oldState, newState) {
    return oldState.focusAddressVersion === newState.focusAddressVersion
  },
  apply(oldState, newState) {
    return ['Viewlet.focusElementByName', newState.uid, InputName.SimpleBrowserAddress]
  },
}

export const render = [renderDom, renderTitle, renderFocusAddress]
