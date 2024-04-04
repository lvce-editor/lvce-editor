import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const createPanelTab = (tab, badgeCount, isSelected) => {
  const label = tab
  let className = 'PanelTab'
  if (isSelected) {
    className += ' PanelTabSelected'
  }
  const dom = [
    div(
      {
        className,
        role: AriaRoles.Tab,
        ariaSelected: isSelected,
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
    console.log({ tab, badgeCount })
    dom.push(...createPanelTab(tab, badgeCount, isSelected))
  }
  return dom
}
