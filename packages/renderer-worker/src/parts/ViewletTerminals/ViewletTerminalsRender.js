import * as GetTerminalTabsDom from '../GetTerminalTabsDom/GetTerminalTabsDom.js'

export const hasFunctionalRender = true

const renderTabs = {
  isEqual(oldState, newState) {
    return oldState.tabs === newState.tabs && oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    const { x, y, width, height, tabsWidth, tabs, selectedIndex, terminalTabsEnabled } = newState
    if (!terminalTabsEnabled) {
      return []
    }
    const dom = GetTerminalTabsDom.getTerminalTabsDom(tabs, width - tabsWidth, y, tabsWidth, height, selectedIndex)
    return ['setTabsDom', dom]
  },
}

export const render = [renderTabs]
