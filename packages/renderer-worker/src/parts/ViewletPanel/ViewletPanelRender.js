import * as GetPanelTabsVirtualDom from '../GetPanelTabsVirtualDom/GetPanelTabsVirtualDom.js'

export const hasFunctionalRender = true

const renderTabs = {
  isEqual(oldState, newState) {
    return oldState.views === newState.views && oldState.selectedIndex === newState.selectedIndex && oldState.badgeCounts === newState.badgeCounts
  },
  apply(oldState, newState) {
    const dom = GetPanelTabsVirtualDom.getPanelTabsVirtualDom(newState.views, newState.selectedIndex, newState.badgeCounts)
    return [/* method */ 'setTabsDom', /* tabs */ dom]
  },
}

export const render = [renderTabs]
