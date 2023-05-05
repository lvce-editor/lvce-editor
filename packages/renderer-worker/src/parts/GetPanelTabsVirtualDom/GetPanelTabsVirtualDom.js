import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const createPanelTab = (tab) => {
  const { isSelected, label } = tab
  let className = 'PanelTab'
  if (isSelected) {
    className += ' PanelTabSelected'
  }
  return [
    div(
      {
        className,
        role: 'tab',
      },
      1
    ),
    text(label),
  ]
}

export const getPanelTabsVirtualDom = (tabs) => {
  const dom = tabs.flatMap(createPanelTab)
  return dom
}
