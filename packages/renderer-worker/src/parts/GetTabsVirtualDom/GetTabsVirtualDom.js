import * as TabFlags from '../TabFlags/TabFlags.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

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
  const tabElement = {
    type: VirtualDomElements.Div,
    className: tabClassName,
    role: AriaRoles.Tab,
    draggable: true,
    width: actualTabWidth,
    ariaSelected: isActive,
    title: uri,
    childCount: 2,
  }
  const dom = [
    tabElement,
    {
      type: VirtualDomElements.Div,
      className: fileIconClassName,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.TabLabel,
      childCount: 1,
    },
    text(tab.label),
  ]

  if (isHovered) {
    tabElement.childCount++
    dom.push({
      type: VirtualDomElements.Button,
      className: 'EditorTabCloseButton',
      title: 'Close',
      childCount: 0,
    })
  } else if (isDirty) {
    tabElement.childCount++
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: 'Circle',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'MaskIcon TabDirtyIcon',
        childCount: 0,
      }
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
