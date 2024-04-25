import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as TabFlags from '../TabFlags/TabFlags.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getIconDom = (icon) => {
  if (icon.startsWith('MaskIcon')) {
    return {
      type: VirtualDomElements.Div,
      className: `TabIcon ${icon}`,
      childCount: 0,
    }
  }
  return GetFileIconVirtualDom.getFileIconVirtualDom(icon)
}

const getTabDom = (tab, isActive, fixedWidth) => {
  const { icon, tabWidth, uri, flags } = tab
  let tabClassName = ClassNames.MainTab
  if (isActive) {
    tabClassName += ' ' + ClassNames.MainTabSelected
  }
  const isDirty = flags & TabFlags.Dirty
  const isHovered = flags & TabFlags.Hovered
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
  const dom = []

  dom.push(
    tabElement,
    getIconDom(icon),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.TabLabel,
      childCount: 1,
    },
    text(tab.label),
  )

  if (isDirty) {
    tabElement.childCount++
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.EditorTabCloseButton,
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'MaskIcon MaskIconCircleFilled',
        childCount: 0,
      },
    )
  } else {
    tabElement.childCount++
    dom.push(
      {
        type: VirtualDomElements.Button,
        className: ClassNames.EditorTabCloseButton,
        title: 'Close',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'MaskIcon MaskIconClose',
        childCount: 0,
      },
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
