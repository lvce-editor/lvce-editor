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
  const hovered = tab.hovered
  const tabElement = div(
    {
      className: tabClassName,
      role: 'tab',
      draggable: true,
      width: tabWidth,
      ariaSelected: isActive,
    },
    2
  )
  const dom = [
    tabElement,
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
  ]
  if (hovered) {
    tabElement.childCount++
    dom.push(
      button(
        {
          className: 'EditorTabCloseButton',
          title: 'Close',
        },
        0
      )
    )
  }
  return dom
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

export const getTabsDom = (tabs, width, activeIndex, deltaX) => {
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
