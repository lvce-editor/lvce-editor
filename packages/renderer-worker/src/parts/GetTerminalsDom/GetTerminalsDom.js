import * as GetTerminalTabsDom from '../GetTerminalTabsDom/GetTerminalTabsDom.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getTabsDom = (state) => {
  const { y, width, height, tabsWidth, tabs, selectedIndex, terminalTabsEnabled, activeTerminalUids, renamingTabUid } = state
  if (!terminalTabsEnabled || !GetTerminalTabsDom.hasVisibleTabs(tabs)) {
    return []
  }
  return GetTerminalTabsDom.getTerminalTabsDom(tabs, width - tabsWidth, y, tabsWidth, height, selectedIndex, activeTerminalUids, renamingTabUid)
}

export const getTerminalsDom = (state) => {
  const { childUids, tabs, terminalTabsEnabled, uid } = state
  const terminalTabsVisible = terminalTabsEnabled && GetTerminalTabsDom.hasVisibleTabs(tabs)
  return [
    {
      type: VirtualDomElements.Div,
      'data-uid': uid,
      onDragOver: 'handleDragOver',
      onDrop: 'handleDrop',
      className: MergeClassNames.mergeClassNames('Viewlet', 'Terminals'),
      childCount: childUids.length + (terminalTabsVisible ? 1 : 0),
      onMouseDown: DomEventListenerFunctions.HandleMouseDown,
    },
    ...getTabsDom(state),
    ...childUids.map((uid) => ({
      type: VirtualDomElements.Reference,
      uid,
    })),
  ]
}
