import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const createPanelTab = (tab, badgeCount, isSelected, index) => {
  const label = tab
  let className = ClassNames.PanelTab
  if (isSelected) {
    className += ' ' + ClassNames.PanelTabSelected
  }
  const dom = [
    div(
      {
        className,
        role: AriaRoles.Tab,
        ariaSelected: isSelected,
        'data-index': index,
        onClick: DomEventListenerFunctions.HandleClickSelectTab,
      },
      1,
    ),
    text(label),
  ]
  if (badgeCount) {
    dom[0].childCount++
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.Badge,
        childCount: 1,
      },
      text(' ' + badgeCount),
    )
  }
  return dom
}

export const getPanelTabsVirtualDom = (tabs, selectedIndex, badgeCounts) => {
  const dom = []
  for (let i = 0; i < tabs.length; i++) {
    const isSelected = i === selectedIndex
    const tab = tabs[i]
    const badgeCount = badgeCounts[tab] || 0
    dom.push(...createPanelTab(tab, badgeCount, isSelected, i))
  }
  return dom
}
