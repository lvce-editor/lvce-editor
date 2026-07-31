import * as GetTerminalTabsDom from '../GetTerminalTabsDom/GetTerminalTabsDom.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getTabsDom = (state) => {
  const { y, width, height, tabsWidth, tabs, selectedIndex, terminalTabsEnabled } = state
  if (!terminalTabsEnabled) {
    return []
  }
  return GetTerminalTabsDom.getTerminalTabsDom(tabs, width - tabsWidth, y, tabsWidth, height, selectedIndex)
}

export const getTerminalsDom = (state) => {
  const { childUids, terminalTabsEnabled } = state
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames('Viewlet', 'Terminals'),
      childCount: childUids.length + (terminalTabsEnabled ? 1 : 0),
      onMouseDown: DomEventListenerFunctions.HandleMouseDown,
    },
    ...getTabsDom(state),
    ...childUids.map((uid) => ({
      type: VirtualDomElements.Reference,
      uid,
    })),
  ]
}
