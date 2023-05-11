import { button, div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

/**
 * @enum {string}
 */
const ClassNames = {
  MainTab: 'MainTab',
  FileIcon: 'FileIcon',
  TabLabel: 'TabLabel',
}

const getTabDom = (tab, isActive, fixedWidth) => {
  const tabClassName = isActive ? 'MainTab MainTabSelected' : ClassNames.MainTab
  const fileIconClassName = `FileIcon FileIcon${tab.icon}`
  const tabWidth = fixedWidth || tab.tabWidth
  return [
    div(
      {
        className: tabClassName,
        role: 'tab',
        draggable: true,
        width: tabWidth,
        ariaSelected: isActive,
      },
      3
    ),
    div(
      {
        className: fileIconClassName,
      },
      0
    ),
    div(
      {
        className: ClassNames.TabLabel,
      },
      1
    ),
    text(tab.label),
    button(
      {
        className: 'EditorTabCloseButton',
        title: 'Close',
      },
      0
    ),
  ]
}

const getTotalTabWidth = (tabs) => {
  let total = 0
  for (const tab of tabs) {
    total += tab.tabWidth
  }
  return total
}

const getFixedWidth = (width, tabsLength, hasOverflow) => {
  if (!hasOverflow) {
    return 0
  }
  return Math.max(width / tabsLength, 80)
}

export const getTabsDom = (tabs, width, activeIndex) => {
  const tabsDom = []
  const totalTabWidth = getTotalTabWidth(tabs)
  const hasOverflow = totalTabWidth > width
  const fixedWidth = getFixedWidth(width, tabs.length, hasOverflow)
  for (let i = 0; i < tabs.length; i++) {
    const isActive = i === activeIndex
    const tab = tabs[i]
    tabsDom.push(...getTabDom(tab, isActive, fixedWidth))
  }
  return tabsDom
}
