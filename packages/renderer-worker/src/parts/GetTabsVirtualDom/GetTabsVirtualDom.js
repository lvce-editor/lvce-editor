import { button, div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as TabFlags from '../TabFlags/TabFlags.js'

/**
 * @enum {string}
 */
const ClassNames = {
  MainTab: 'MainTab',
  FileIcon: 'FileIcon',
  TabLabel: 'TabLabel',
  MainTabSelected: 'MainTabSelected',
}

const getTabDom = (tab, isActive, fixedWidth) => {
  const { icon, tabWidth, uri, flags } = tab
  let tabClassName = ClassNames.MainTab
  if (isActive) {
    tabClassName += ' ' + ClassNames.MainTabSelected
  }
  const isDirty = flags & TabFlags.Dirty
  const isHovered = flags & TabFlags.Hovered
  const fileIconClassName = `FileIcon FileIcon${icon}`
  const actualTabWidth = fixedWidth || tabWidth
  const tabElement = div(
    {
      className: tabClassName,
      role: 'tab',
      draggable: true,
      width: actualTabWidth,
      ariaSelected: isActive,
      title: uri,
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

  if (isHovered) {
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
  } else if (isDirty) {
    tabElement.childCount++
    dom.push(
      div(
        {
          className: 'Circle',
        },
        1
      ),
      div(
        {
          className: 'MaskIcon TabDirtyIcon',
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
