import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const createPanelTab = (tab, isSelected) => {
  const label = tab
  let className = 'PanelTab'
  if (isSelected) {
    className += ' PanelTabSelected'
  }
  return [
    div(
      {
        className,
        role: 'tab',
        ariaSelected: isSelected,
      },
      1
    ),
    text(label),
  ]
}

export const getPanelTabsVirtualDom = (tabs, selectedIndex) => {
  const dom = []
  for (let i = 0; i < tabs.length; i++) {
    const isSelected = i === selectedIndex
    const tab = tabs[i]
    dom.push(...createPanelTab(tab, isSelected))
  }
  return dom
}
