import * as GetPanelTabsVirtualDom from '../GetPanelTabsVirtualDom/GetPanelTabsVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderTabs = {
  isEqual(oldState, newState) {
    return oldState.views === newState.views && oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    const dom = GetPanelTabsVirtualDom.getPanelTabsVirtualDom(newState.views, newState.selectedIndex)
    return [/* method */ 'setTabsDom', /* tabs */ dom]
  },
}

const renderSelectedIndex = {
  isEqual(oldState, newState) {
    return oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetSelectedIndex, /* unFocusIndex */ oldState.selectedIndex, /* focusIndex */ newState.selectedIndex]
  },
}

export const render = [renderTabs]
