import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as Assert from '../Assert/Assert.js'

const getTabClassName = (isSelected) => {
  let className = 'TerminalTab'
  if (isSelected) {
    className += ' TerminalTabSelected'
  }
  return className
}

const createTabDom = (tab, isSelected) => {
  const { label, icon } = tab
  const className = getTabClassName(isSelected)
  return [
    div(
      {
        className,
        role: 'listitem',
      },
      2
    ),
    div(
      {
        className: 'TerminalTabIcon',
        maskImage: icon,
      },
      0
    ),
    text(label),
  ]
}

export const getTerminalTabsDom = (tabs, x, y, width, height, selectedIndex) => {
  Assert.number(x)
  Assert.number(y)
  Assert.number(width)
  Assert.number(height)
  Assert.number(selectedIndex)
  const dom = [
    div(
      {
        className: 'TerminalTabs',
        left: x,
        width,
        height,
        role: 'list',
        ariaLabel: 'Terminal tabs',
      },
      tabs.length
    ),
  ]
  for (let i = 0; i < tabs.length; i++) {
    const isSelected = i === selectedIndex
    const tab = tabs[i]
    dom.push(...createTabDom(tab, isSelected))
  }
  return dom
}
