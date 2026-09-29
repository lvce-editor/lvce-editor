import { button, div, span, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as Assert from '../Assert/Assert.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as TerminalStrings from '../TerminalStrings/TerminalStrings.js'

const getTabClassName = (isSelected, splitIndex, splitCount, isGroupStart) => {
  let className = ClassNames.TerminalTab
  if (isSelected) {
    className += ' ' + ClassNames.TerminalTabSelected
  }
  if (splitCount > 1) {
    className += ' ' + ClassNames.TerminalTabSplit
    if (splitIndex === 0) {
      className += ' ' + ClassNames.TerminalTabSplitFirst
    } else if (splitIndex === splitCount - 1) {
      className += ' ' + ClassNames.TerminalTabSplitLast
    } else {
      className += ' ' + ClassNames.TerminalTabSplitMiddle
    }
  }
  if (isGroupStart) {
    className += ' ' + ClassNames.TerminalTabGroupStart
  }
  return className
}

const getTerminalUids = (tab) => {
  return tab.terminalUids || [tab.uid]
}

const createTabDom = (tab, index, terminalUid, splitIndex, splitCount, isSelected, isGroupStart) => {
  const { label, icon } = tab
  const isSplit = splitCount > 1
  const className = getTabClassName(isSelected, splitIndex, splitCount, isGroupStart)
  return [
    div(
      {
        draggable: true,
        onPointerDown: 'handleTabPointerDown',
        onDragStart: 'handleDragStart',
        onDragEnd: 'handleDragEnd',
        'data-index': index,
        'data-terminalUid': terminalUid,
        className,
        onClick: DomEventListenerFunctions.HandleClickTab,
        role: AriaRoles.ListItem,
      },
      3,
    ),
    div(
      {
        className: ClassNames.TerminalTabIcon,
        maskImage: `/icons/${icon}.svg`,
      },
      0,
    ),
    span(
      {
        className: ClassNames.TerminalTabLabel,
      },
      1,
    ),
    text(label),
    button(
      {
        ariaLabel: TerminalStrings.killTerminal(),
        'data-command': isSplit ? 'killTerminalSplit' : 'killTerminalTab',
        'data-index': index,
        'data-terminalUid': terminalUid,
        className: ClassNames.TerminalTabKill,
        onClick: DomEventListenerFunctions.HandleClickTerminalTabAction,
        title: TerminalStrings.killTerminal(),
      },
      1,
    ),
    div(
      {
        className: ClassNames.TerminalTabKillIcon,
      },
      0,
    ),
  ]
}

export const hasVisibleTabs = (tabs) => {
  return tabs.length > 0
}

export const getTerminalTabsDom = (tabs, x, y, width, height, selectedIndex, activeTerminalUids = []) => {
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
      tabs.reduce((count, tab) => count + getTerminalUids(tab).length, 0),
    ),
  ]
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i]
    const terminalUids = getTerminalUids(tab)
    const activeTerminalUid = activeTerminalUids[i] || terminalUids[0]
    for (let j = 0; j < terminalUids.length; j++) {
      const terminalUid = terminalUids[j]
      const isSelected = i === selectedIndex && terminalUid === activeTerminalUid
      const isGroupStart = i > 0 && j === 0
      dom.push(...createTabDom(tab, i, terminalUid, j, terminalUids.length, isSelected, isGroupStart))
    }
  }
  return dom
}
