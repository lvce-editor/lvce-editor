import * as GetTabDom from '../GetTabDom/GetTabDom.js'

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
    tabsDom.push(...GetTabDom.getTabDom(tab, isActive, fixedWidth))
  }
  return tabsDom
}
