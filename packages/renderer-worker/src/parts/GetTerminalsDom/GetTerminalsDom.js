import * as GetTerminalTabsDom from '../GetTerminalTabsDom/GetTerminalTabsDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getTabsDom = (state) => {
  const { y, width, height, tabsWidth, tabs, selectedIndex, terminalTabsEnabled } = state
  if (!terminalTabsEnabled) {
    return []
  }
  return GetTerminalTabsDom.getTerminalTabsDom(tabs, width - tabsWidth, y, tabsWidth, height, selectedIndex)
}

export const getTerminalsDom = (state) => {
  const { childUid, terminalTabsEnabled } = state
  return [
    {
      type: VirtualDomElements.Div,
      childCount: terminalTabsEnabled ? 2 : 1,
    },
    ...getTabsDom(state),
    {
      type: VirtualDomElements.Reference,
      uid: childUid,
    },
  ]
}
