import { diffTree } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetSimpleBrowserHistoryVirtualDom from '../GetSimpleBrowserHistoryVirtualDom/GetSimpleBrowserHistoryVirtualDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const renderEventListeners = () => {
  return [
    {
      name: DomEventListenerFunctions.HandleInputSimpleBrowserHistory,
      params: ['handleInput', 'event.target.value'],
    },
    {
      name: DomEventListenerFunctions.HandleScrollSimpleBrowserHistory,
      params: ['handleScroll', 'event.target.scrollTop', 'event.target.clientHeight'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserHistoryClear,
      params: ['clearHistory'],
    },
    {
      name: DomEventListenerFunctions.HandleClickSimpleBrowserHistoryRemove,
      params: ['removeEntry', 'event.currentTarget.dataset.index'],
    },
  ]
}

const renderDom = {
  isEqual(oldState, newState) {
    return (
      oldState.loaded === newState.loaded &&
      oldState.entries === newState.entries &&
      oldState.searchValue === newState.searchValue &&
      oldState.scrollTop === newState.scrollTop &&
      oldState.viewportHeight === newState.viewportHeight
    )
  },
  apply(oldState, newState) {
    const newDom = GetSimpleBrowserHistoryVirtualDom.getSimpleBrowserHistoryVirtualDom(
      newState.entries,
      newState.searchValue,
      oldState.searchValue,
      newState.scrollTop,
      newState.viewportHeight,
    )
    if (!oldState.loaded) {
      return [
        'Viewlet.setDom2',
        GetSimpleBrowserHistoryVirtualDom.getSimpleBrowserHistoryVirtualDom(
          newState.entries,
          newState.searchValue,
          newState.searchValue,
          newState.scrollTop,
          newState.viewportHeight,
        ),
      ]
    }
    const oldDom = GetSimpleBrowserHistoryVirtualDom.getSimpleBrowserHistoryVirtualDom(
      oldState.entries,
      oldState.searchValue,
      oldState.searchValue,
      oldState.scrollTop,
      oldState.viewportHeight,
    )
    const patches = /** @type {readonly unknown[]} */ (diffTree(oldDom, newDom))
    return ['Viewlet.setTreePatches', patches]
  },
}

export const render = [renderDom]
