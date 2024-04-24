import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as Assert from '../Assert/Assert.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'

const getTabClassName = (isSelected) => {
  let className = ClassNames.TerminalTab
  if (isSelected) {
    className += ' ' + ClassNames.TerminalTabSelected
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
        role: AriaRoles.ListItem,
      },
      2,
    ),
    div(
      {
        className: ClassNames.TerminalTabIcon,
        maskImage: icon,
      },
      0,
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
        className: ClassNames.TerminalTabs,
        left: x,
        width,
        height,
        role: AriaRoles.List,
        ariaLabel: 'Terminal tabs',
      },
      tabs.length,
    ),
  ]
  for (let i = 0; i < tabs.length; i++) {
    const isSelected = i === selectedIndex
    const tab = tabs[i]
    dom.push(...createTabDom(tab, isSelected))
  }
  return dom
}
